import React, { useRef, useState, /*useEffect*/ } from "react";
import Moveable from "react-moveable";

const App = () => {
  const [moveableComponents, setMoveableComponents] = useState([]);
  const [selected, setSelected] = useState(null);

  // fetch-api "https://jsonplaceholder.typicode.com/photos" PARA LA IMAGEN DE LA API, PERO LA API SOLO DEVUELVE UNA IMAGEN PLACEHOLDER
  // QUE DICE 600X600 Y AL HACER EL RESIZE DESAPARECE, AUNQUE SE PUEDE SELECCINAR EL ELEMENTO PUES AHI SIGUE.

  // const [images, setImages] = useState([]);
  // useEffect(() => {
  //   fetch("https://jsonplaceholder.typicode.com/photos")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setImages(data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching images:", error);
  //     });
  // }, []);


  const addMoveable = () => {
    // Create a new moveable component and add it to the array
    const COLORS = ["red", "blue", "yellow", "green", "purple"];

    // PARA TARER LA IMAGEN RANDOM DE LA API, PERO ESTA SUELE DESAPAREECR AL HACER RESIZE, SE PUEDE PROBAR DESCOMENTANDO 
    // TODAS LAS PARTES INDICADAS REFERENTE AL IMAGE O IMAGE-URL
    // const randomImage = images[Math.floor(Math.random() * images.length)];


    setMoveableComponents([
      ...moveableComponents,
      {
        id: Math.floor(Math.random() * Date.now()),
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        // ESTA PROPIEDAD ES LA QUE CARGA LA IMAGEN AL TRAERLA DE LA API, LA CUAL TERMINA SIENDO UN PLACEHOLDER NADA MAS
        // imageUrl: randomImage?.url,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        updateEnd: true
      },
    ]);
  };

  // 
  // REMOVER ELEMENTO SELECCIONADO
  const removeMoveable = () => {
    const newMoveableComponents = moveableComponents.filter(moveable => moveable.id !== selected);
    setMoveableComponents(newMoveableComponents);
    setSelected(null);
  }

  const updatedMoveable = (id, newComponent, updateEnd = false) => {
    const updatedMoveables = moveableComponents.map((moveable, i) => {
      if (moveable.id === id) {
        return { id, ...newComponent, updateEnd };
      }
      return moveable;
    })
    setMoveableComponents(updatedMoveables);
  }

  const handleResizeStart = (index, e) => {
    // Check if the resize is coming from the left handle
    const [handlePosX, /*handlePosY*/] = e.direction;
    // 0 => center
    // -1 => top or left
    // 1 => bottom or right

    // -1, -1
    // -1, 0
    // -1, 1
    if (handlePosX === -1) {
      // Save the initial left and width values of the moveable component
      const initialLeft = e.left;
      const initialWidth = e.width;

      // Set up the onResize event handler to update the left value based on the change in width

      e.onResize = (e) => {
        const { left, width } = e;
        const newComponent = { left: left - initialLeft, width: width + initialWidth };
        updatedMoveable(index, newComponent, true);
      };
    }
  }

  return (
    <main style={{ height: "100vh", width: "100vw" }}>
      <button onClick={addMoveable}>Add Moveable1</button>
      <button onClick={removeMoveable}>Remove Moveable1</button>
      <div
        id="parent"
        style={{
          position: "relative",
          background: "black",
          height: "80vh",
          width: "80vw",
        }}
      >
        {moveableComponents.map((item, index) => (
          <Component
            {...item}
            key={index}
            updateMoveable={updatedMoveable}
            handleResizeStart={handleResizeStart}
            setSelected={setSelected}
            isSelected={selected === item.id}
          />
        ))}
      </div>
    </main>
  );
};

export default App;

const Component = ({
  updateMoveable,
  top,
  left,
  width,
  height,
  index,
  // IGUAL ES LA PROPIEDAD QUE OBTENEMOS DEL LA IMAGEN PERO NO SE MANTIENE
  // imageUrl,
  color,
  id,
  setSelected,
  isSelected = false,
  updateEnd,
}) => {
  const ref = useRef();

  const [nodoReferencia, setNodoReferencia] = useState({
    top,
    left,
    width,
    height,
    index,
    color,
    id,
  });

  let parent = document.getElementById("parent");
  let parentBounds = parent?.getBoundingClientRect();


  const onResize = async (e) => {
    // ACTUALIZAR ALTO Y ANCHO
    let newWidth = e.width;
    let newHeight = e.height;

    const positionMaxTop = top + newHeight;
    const positionMaxLeft = left + newWidth;

    if (positionMaxTop > parentBounds?.height)
      newHeight = parentBounds?.height - top;
    if (positionMaxLeft > parentBounds?.width)
      newWidth = parentBounds?.width - left;

    updateMoveable(id, {
      top,
      left,
      width: newWidth,
      height: newHeight,
      color,
    });

    // ACTUALIZAR NODO REFERENCIA
    const beforeTranslate = e.drag.beforeTranslate;

    ref.current.style.width = `${e.width}px`;
    ref.current.style.height = `${e.height}px`;

    let translateX = beforeTranslate[0];
    let translateY = beforeTranslate[1];

    ref.current.style.transform = `translate(${translateX}px, ${translateY}px)`;

    setNodoReferencia({
      ...nodoReferencia,
      translateX,
      translateY,
      top: top + translateY < 0 ? 0 : top + translateY,
      left: left + translateX < 0 ? 0 : left + translateX,
      width: newWidth,
      height: newHeight,
      index,
      color,
      id,
      updateEnd

    })
  }

  // SE ACTUALIZA SOLAMENTE USANDO EL NODOREFERENCIA
  const onResizeEnd = async (e) => {
    updateEnd(nodoReferencia)
  }

  return (
    <>
      <div
        ref={ref}
        className="draggable"
        id={"component-" + id}
        style={{
          position: "absolute",
          top: top,
          left: left,
          width: width,
          height: height,
          background: color,
          // ESTAS SON LAS PROPIEDADES PARA QUE SEA VISIBLE LA IMAGEN, PERO LA API SOLO DEVUELVE UN PLACEHOLDER DE UNA IMAGEN,
          //  Y SOLO ES VISIBLE AL GENERARSE PERO NO SE MANTIENE EN EL RESIZE
          // background: `url(${imageUrl})`,
          // backgroundSize: "cover",
        }}
        onClick={() => setSelected(id)}
      />

      <Moveable
        target={isSelected && ref.current}
        resizable
        draggable
        onDrag={(e) => {
          const newTop = Math.max(0, e.top);
          const newLeft = Math.max(0, e.left);

          const parentWidth = parentBounds?.width - e.width;
          const parentHeight = parentBounds?.height - e.height;

          const adjustedTop = Math.min(newTop, parentHeight);
          const adjustedLeft = Math.min(newLeft, parentWidth);

          updateMoveable(id, {
            top: adjustedTop,
            left: adjustedLeft,
            width,
            height,
            color,
          });
        }}
        onResize={onResize}
        onResizeEnd={onResizeEnd}
        keepRatio={false}
        throttleResize={1}
        renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
        edge={false}
        zoom={1}
        origin={false}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
      />
    </>
  );
};
