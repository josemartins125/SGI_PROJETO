import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js";



class Website {
    constructor() {
      this._Initialize(0,20,15);
    }

  _Initialize(x, y ,z) {
    var colorChange = document.querySelectorAll(".colorChange-element");
    var cameraChange = document.querySelectorAll(".cameraChange-element");

    var animateRange = null;
    var Animations = new Array();
    var animationMixer = new THREE.AnimationMixer();
      animateRange = document.querySelector("#slider");
      animateRange.setAttribute("min", 0);
      animateRange.setAttribute("max", 75);
      animateRange.setAttribute("step", 0.001);
      animateRange.setAttribute("value", 0);
      window.clock = 0;


    this._threejs = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.physicallyCorrectLights = true;
    this._threejs.toneMapping = THREE.ACESFilmicToneMapping;
    this._threejs.outputEncoding = THREE.sRGBEncoding;

    const productDiv = document.getElementById('productCanva');
    productDiv.appendChild(this._threejs.domElement);
    this._threejs.setSize(productDiv.offsetWidth, productDiv.offsetHeight);
    this._threejs.setPixelRatio(productDiv.devicePixelRatio);

    window.addEventListener('resize', () => {
        this._OnWindowResize(productDiv);
      }, false);

      
    const fov = 60;
    const aspect = productDiv.offsetWidth / productDiv.offsetHeight;
    const near = 1.0;
    const far = 1000.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(x, y, z);
    
    this._scene = new THREE.Scene();

    let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(20, 0, 10);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    this._scene.add(light);

    light = new THREE.AmbientLight(0xFFFFFF);
    this._scene.add(light);

    const controls = new OrbitControls(
      this._camera, this._threejs.domElement);
    controls.target.set(0, 20, 0);
    controls.update();
      var camera = this._camera;


    cameraChange.forEach((cm) => {
      cm.onclick = function () {
        cameraChangefunc(camera,this.getAttribute("primary"),this.getAttribute("secondary"),this.getAttribute("terciary"))
        controls.update();
      };
    });

    const loader = new GLTFLoader();
    loader.setPath('./renders/');
      
    
    loadGLTF(loader, this._scene, colorChange, animationMixer, Animations, animateRange);

    this._RAF();
  }

  _OnWindowResize(productDiv) {
    this._camera.aspect = productDiv.offsetWidth / productDiv.offsetHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(productDiv.offsetWidth, productDiv.offsetHeight);
  }

  _RAF() {
    requestAnimationFrame(() => {
      this._threejs.render(this._scene, this._camera,);
      this._RAF();
    });
  }

  _Reinitialize(x,y,z){
    this._Initialize(x,y,z)
  }

}
 // function setColorName(name) {
  //  document.getElementById("colorSquare").innerText = firstToUpper(name);
  //}

  function loadGLTF(loader, _scene,colorChange,animationMixer,Animations,animateRange){
    loader.load('mesa.gltf', (gltf) => {

      const model = gltf.scene;
      model.traverse(o => {
            o.castShadow = true;
        });
        _scene.add(gltf.scene);
        _scene.position.set( 0, 15, 0 );
        setWoodMaterial("Wood028_2K_Color.png",null,gltf);

        colorChange.forEach((ce) => {
          ce.onclick = function () {
            if(this.getAttribute("primary") === "default"){
              _scene.remove(gltf.scene);
              loadGLTF(loader, _scene,colorChange,animationMixer,Animations,animateRange)
            }else{
              setWoodMaterial(this.getAttribute("primary"),this.getAttribute("secondary"),gltf);
            }
          };
        });

        
        animationMixer = new THREE.AnimationMixer(gltf.scene);
        Animations.push(
            animationMixer.clipAction(
                THREE.AnimationClip.findByName(gltf.animations, "DoorLeft_Rotation")
            )
        );
        Animations.push(
            animationMixer.clipAction(
                THREE.AnimationClip.findByName(gltf.animations, "drawerUpAction")
            )
        );
        Animations.push(
            animationMixer.clipAction(
                THREE.AnimationClip.findByName(gltf.animations, "doorRightAction")
            )
        );
        Animations.push(
            animationMixer.clipAction(
                THREE.AnimationClip.findByName(gltf.animations, "drawerDownAction")
            )
        );
          
        var max = 0;
          for (let i = 0; i < Animations.length; i++) {
              Animations[i].play();
              Animations[i].paused = false;
              if (Animations[i]._clip.duration > max) {
                  max = Animations[i]._clip.duration;
              }
          }
          animateRange.setAttribute("max", max - 0.01);
          

          animateRange.oninput = function () {
            let v = this.value;
            var newValue = ((v * 1.250) / 1.675)
            window.clock = newValue;
            animationMixer.setTime(window.clock);
          };
          animationMixer.setTime(window.clock);
    
      });
  }

  function cameraChangefunc(camera,x,y,z){
    camera.position.set(x, y, z);
  }

  function setWoodMaterial(material,material2,gltf) {
    setObjMaterial(material,material2,gltf);
  }


  function setObjMaterial(material,material2,gltf) {
    const loader = new THREE.TextureLoader();


    loader.load(
        "./renders/" + material,
        function (texture) {
          if(material2 != null){
          gltf.scene.traverse(child => {
            if (child.name === "Cube015") {
            //  console.log(child.material.map);
              child.material.map = loader.load("./renders/" + material2) 
              }
            });
          }
            gltf.scene.getObjectByName("rack").material.map = texture;
        },
        undefined,
        function (err) {
            console.error("An error happened.");
        }
    );
  }



let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new Website();
});

window.addEventListener('scroll', (e) => {
  _APP.OnScroll(window.scrollY);
});