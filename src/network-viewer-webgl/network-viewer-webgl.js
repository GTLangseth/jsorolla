function NetworkViewerWebgl(args) {
    _.extend(this, Backbone.Events);
    this.id = Utils.genId('NetworkViewerWebgl');

    this.width = 800;
    this.height = 600;

    this.scene;
    this.camera;
    this.renderer;

    this.target;
    this.cameraRadius;
    this.cameraTheta;
    this.cameraPhi;
    this.autoRender = true;


    this.elements = {};

    //set instantiation args, must be last
    _.extend(this, args);


    this.on(this.handlers);
    if (this.autoRender) {
        this.render();
    }
}


NetworkViewerWebgl.prototype = {
    render: function () {
        var _this = this;

        this.targetEl = ( this.target instanceof HTMLElement ) ? this.target : document.querySelector('#' + this.target);

        this.initScene();
//
//
//        setTimeout(function () {
//            _this.renderScene();
//        }, 100);

    },
    renderVertex: function (vertex, mainGeometry, updateScene) {

        var element = this.elements[vertex.id];
        if (element != null) {
            target.remove(element);

        }


        /** vertex representation **/
//        var H = Math.random();
//        var S = 0.9;
//        var L = 0.7;
//        if (this.potyvirusPorteinNames.indexOf(vertex.id) !== -1) {
//            H = 1;
//            S = 1;
//            L = 1;
//        }

//        var spriteMaterial = new THREE.SpriteMaterial({ map: this.particleTexture, useScreenCoordinates: false, color: 0xffffff });
//        var sprite = new THREE.Sprite(spriteMaterial);
//        sprite.scale.set(32, 32, 1.0); // imageWidth, imageHeight
//        sprite.material.color.setHSL(H, S, L);
//        sprite.material.blending = THREE.AdditiveBlending;
////        this.groupElements.add(sprite);


        var geometry = new THREE.BoxGeometry(10, 10, 10);
        var material = new THREE.MeshNormalMaterial();
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(vertex.position.x, vertex.position.y, vertex.position.z);

//        THREE.GeometryUtils.merge(mainGeometry, cube);
//        .merge( geometry2, matrix, materialIndexOffset )
        /** ************************/


        this.elements[vertex.id] = cube;

        if (updateScene != false) {
            this.renderScene();
        }

    },
    renderEdge: function (edge, mainGeometry, updateScene) {

//        var edgeConfig = network.config.getEdgeConfig(edge);
//        var sourceConfig = network.config.getVertexConfig(edge.source);
//        var targetConfig = network.config.getVertexConfig(edge.target);
//
//        var sourceCoords = sourceConfig.coords;
//        var targetCoods = targetConfig.coords;

        var element = this.elements[edge.id];
        if (element != null) {
            target.remove(element);
        }
//        /** vertex representation **/
//        var H = Math.random();
//        var S = 0.9;
//        var L = 0.7;
//        if (this.potyvirusPorteinNames.indexOf(edge.source.id) !== -1) {
//            H = 1;
//            S = 1;
//            L = 1;
//        }

        var material = new THREE.LineBasicMaterial({color: 0x222222});
//        material.color.setHSL(H, S, L);
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(edge.source.position.x, edge.source.position.y, edge.source.position.z));
        geometry.vertices.push(new THREE.Vector3(edge.target.position.x, edge.target.position.y, edge.target.position.z));
        var line = new THREE.Line(geometry, material);
        THREE.GeometryUtils.merge(mainGeometry, line);
        /** ************************/

        this.elements[edge.id] = line;

        if (updateScene != false) {
            this.renderScene();
        }

    },

    renderGraph: function (graph) {

        this.renderScene();

        var geometry = new THREE.Geometry();


        var edges = graph.edges;
        var vertices = graph.vertices;
        for (var i = 0, l = vertices.length; i < l; i++) {
            var vertex = vertices[i];
            if (typeof vertex !== 'undefined') {
                this.renderVertex(vertex, geometry, false);
            }
        }
//        for (var i = 0, l = edges.length; i < l; i++) {
//            var edge = edges[i];
//            if (typeof edge !== 'undefined') {
//                this.renderEdge(edge, geometry, false);
//            }
//        }
        this.scene.add(geometry);

        this.renderScene();
    },
    clean: function () {
        for (var element in this.elements) {
            this.scene.remove(this.elements[element]);
        }
    },
    initScene: function () {
//        this.particleTexture = THREE.ImageUtils.loadTexture('images/spark.png');

        // camera vars
        this.cameraRadius = 1600;
        this.cameraTheta = 45;
        this.cameraPhi = 5;

        // set the scene size
        var WIDTH = this.width;
        var HEIGHT = this.height;

        // set some camera attributes
        var VIEW_ANGLE = 45,
            ASPECT = WIDTH / HEIGHT,
            NEAR = 1,
            FAR = 10000;


        // create a WebGL renderer, camera
        // and a scene
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            preserveDrawingBuffer: true,
            alpha: true
        });
        this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        this.scene = new THREE.Scene();


        // start the renderer
        this.renderer.setSize(WIDTH, HEIGHT);

        // attach the render-supplied DOM element
        $(this.targetEl).append(this.renderer.domElement);

        // and the camera
        this.scene.add(this.camera);


        // create a point light
        var pointLight = new THREE.PointLight(0xFFFFFF);

        // set its position
        pointLight.position.x = 10;
        pointLight.position.y = 50;
        pointLight.position.z = 200;


        // add to the scene
        this.scene.add(pointLight);

        //create an empty container
        this.groupElements = new THREE.Object3D();

        // debug plane
        var planeW = 600;
        var planeH = 600;
        var plane = new THREE.Mesh(
//            new THREE.PlaneGeometry(planeW * 40, planeH * 40, planeW, planeH),
            new THREE.PlaneGeometry(planeW, planeH),
            new THREE.MeshBasicMaterial({
                shading: THREE.SmoothShading,
                color: 0x333333,
                wireframe: true,
//                wireframeLinewidth: 1,
                opacity: 0.5
            })
        );
//        var plane = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.MeshNormalMaterial({ shading: THREE.SmoothShading }));
//        plane.overdraw = true;
        this.scene.add(plane);

        //To use enter the axis length
        //{x: red, y: green, z: blue}
        debugaxis(500, this.scene);

        this.renderScene();

        // attach controls
        this.setControls();


    },
    renderScene: function () {
//        θ = theta
//        φ = phi

//        x= r sin(theta) cos(phi)
//        y= r sin(theta) sin(phi)
//        z= r cos(theta)

//        r ≥ 0
//        0° ≤ θ ≤ 180° (π rad)
//        0° ≤ φ < 360° (2π rad)

        this.camera.position.x = this.cameraRadius * Math.sin(this.cameraTheta * Math.PI / 180) * Math.cos(this.cameraPhi * Math.PI / 180);
        this.camera.position.y = this.cameraRadius * Math.sin(this.cameraTheta * Math.PI / 180) * Math.sin(this.cameraPhi * Math.PI / 180);
        this.camera.position.z = this.cameraRadius * Math.cos(this.cameraTheta * Math.PI / 180);


        this.camera.updateMatrix();
        this.camera.up.set(0, 0, 1);
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
//        console.log({x: camera.position.x, y: camera.position.y, z: camera.position.z});
//        console.log({r: cameraRadius, theta: theta, phi: phi});
    },
    setControls: function () {
        var _this = this;
        this.targetEl.addEventListener('mousewheel', function (event) {
            _this.cameraRadius -= event.wheelDeltaY;
            _this.cameraRadius = Math.min(_this.cameraRadius, 2000);
            _this.cameraRadius = Math.max(_this.cameraRadius, 10);
            if (_this.cameraRadius > 10 && _this.cameraRadius < 2000) {
                _this.renderScene();
            }
        }, false);

        $('body').keydown(function (event) {
            switch (event.keyCode) {
                case 38: //up arrow key
                    _this.cameraTheta -= 1;
                    break;
                case 39: //right arrow key
                    _this.cameraPhi += 1;
                    break;
                case 40: //down arrow key
                    _this.cameraTheta += 1;
                    break;
                case 37: //left arrow key
                    _this.cameraPhi -= 1;
                    break;
                default:
            }
            _this.cameraPhi = _this.cameraPhi % 360;
            _this.cameraTheta = Math.min(_this.cameraTheta, 89);
            _this.cameraTheta = Math.max(_this.cameraTheta, 1);
            if (_this.cameraTheta > 0 && _this.cameraTheta < 90) {
                _this.renderScene();
            }
        });
        $(this.targetEl).mousedown(function (mouseDownEvent) {
            var mouseDownX = mouseDownEvent.clientX;
            var mouseDownY = mouseDownEvent.clientY;
            $(this).mousemove(function (mouseMoveEvent) {
                if (mouseDownEvent.which == 1) {

                    _this.cameraPhi -= mouseMoveEvent.clientX - mouseDownX;
                    _this.cameraPhi = _this.cameraPhi % 360;

                    _this.cameraTheta += mouseMoveEvent.clientY - mouseDownY;
                    _this.cameraTheta = Math.min(_this.cameraTheta, 89);
                    _this.cameraTheta = Math.max(_this.cameraTheta, 1);

                    mouseDownX = mouseMoveEvent.clientX;
                    mouseDownY = mouseMoveEvent.clientY;
                    if (_this.cameraTheta > 0 && _this.cameraTheta < 90) {
                        _this.renderScene();
                    }
                }
            });

        });
        $(this.targetEl).mouseup(function () {
            $(this).off('mousemove');
        });
        $(this.targetEl).mouseleave(function () {
            $(this).off('mousemove');
        });
    }
}