---
layout: post
title: "Three.js 5 debug UI"
categories: Three.js
tags: Three.js WebGL
author: HyG
---

* content
{:toc}

This series is [Three.js journey](https://threejs-journey.com/) tutorial study notes.

This section will learn about debug UI. Used to conveniently adjust various parameters of animations or objects in real time. We can develop it ourselves or use a third-party library. Here we choose to use a ready-made library.




Common libraries include

- dat.GUI
-control-panel
-ControlKit
- Guify
-Oui

# dat.GUI

We will learn [dat.GUI](https://github.com/dataarts/dat.gui). The api of this debugUI is also very simple. You can directly refer to [api document](https://github.com/dataarts/dat.gui/blob/master/API.md)

We add the following code

```js
/**
  * Debug
  */
const gui = new dat.GUI({
   // closed: true,
   width: 400,
})
// gui.hide() // press H to show

gui.add(cubeMesh.position, 'y').min(-3).max(3).step(0.01)
   .name('cubeMesh Y') // Alias
gui.add(cubeMesh.position, 'x').min(-3).max(3).step(0.01)
gui.add(cubeMesh.position, 'z').min(-3).max(3).step(0.01)

gui.add(cubeMesh, 'visible') // boolean
gui.add(cubeMesh.material, 'wireframe') // boolean

const debugObj = {
   color: defaultColor,
   spin() {
     gsap.to(cubeMesh.rotation, {
       duration: 1,
       y: cubeMesh.rotation.y + Math.PI * 2,
     })
   },
}

gui.addColor(debugObj, 'color').onChange((e) => {
   cubeMesh.material.color.set(e)
})

gui.add(debugObj, 'spin') // function
```

The effect is as follows

![](https://gw.alicdn.com/imgextra/i4/O1CN014PYQlU1eZprccV5TV_!!6000000003886-2-tps-410-224.png)

Dynamic presentation

![](https://gw.alicdn.com/imgextra/i2/O1CN01ITDxTh1rEqit3lgtY_!!6000000005600-1-tps-1131-581.gif)

# Summary

Debug UI can be added during project development, and the development process can be continuously adjusted to find the best value.