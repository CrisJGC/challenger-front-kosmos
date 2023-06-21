Este es un challenge frontend de parte de la empresa **KOSMOS**

El proyecto esta desarrollado con React, para instalar las dependencias solo es usar 
```js
 npm install
```
y se inicializa el proyecto con 
```js
npm start
```

Se aclara que el Api se realizo pero solo regreso una imagen que dice de fondo 600x600 con diferentes colores, y al hacer el resize este desaparece, solo el color, el elemento sigue estando presente.

Por otro lado, el elemento se limita al div, pero solo cuando se crea y se hace drag.
Cuando se hace un resize esta propiedad se pierde, ya que al hacer drag de nuevo ya es posible salir, es necesario reajustar su posicion despues de esto, ya que el limite sigue estando, pero este se recorre segun sea de gran el resize.

1. Los componentes no deben de salirse del div con id "parent" al arrastrarse

2. Cada componente debe de tener una imagen única, la cual con estilos propios, no debe salir del componente al que se le hace resize y deben de tener un fit diferente "cover", "contain", etc. e
  
  **Esta se obtiene de un fetch a la api "https://jsonplaceholder.typicode.com/photos"**

3. Se debe de mantener la selección correctamente al hacer resize o drag, desde cualquiera de los 8 puntos (es decir, debe abarcar el componente mismo, no debe de estar abarcando cosas fuera de el) **Referencia del comportamiento que se debe corregir (Video 1)**

4. Los componentes se deben de poder eliminar de la lista de componentes

5. (Extra) La librería tiene la capacidad de mostrar las líneas guía de cada componente, debes mostrarlas cada que se haga drag del componente seleccionado. La documentación de la librería está aquí: https://daybrush.com/moveable/release/latest/doc/

5. (Extra) El código entregado tiene falta de documentación en sus funciones, por lo que también deberás documentar las funciones correctamente
