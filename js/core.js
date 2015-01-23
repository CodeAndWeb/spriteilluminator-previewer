var example1 = example1 || {};

example1 = function(DOM_Element) {

    // Create a pixi renderer
    _globals.renderer = PIXI.autoDetectRenderer(_globals.viewWidth, _globals.viewHeight);
    _globals.renderer.view.className = "rendererView";

    // add render view to DOM
    document.getElementById(DOM_Element).appendChild(_globals.renderer.view);

    // create an new instance of a pixi stage
    _globals.stage = new PIXI.Stage(0xFFFFFF);

    _globals.lightImage = PIXI.Texture.fromImage("light-no-arrows.png")

    // create a background texture
    _globals.backgroundLightFilter = new PIXI.NormalMapFilter(PIXI.Texture.fromImage("all_n.png"));
    var backgroundSprite = PIXI.Sprite.fromImage("all.png");
    backgroundSprite.filters = [_globals.backgroundLightFilter];
     _globals.stage.addChild(backgroundSprite);

/*
 
    // create a background texture
    _globals.backgroundLightFilter = new PIXI.NormalMapFilter(PIXI.Texture.fromImage("background_n.png"));
    var backgroundSprite = PIXI.Sprite.fromImage("background.png");
    backgroundSprite.filters = [_globals.backgroundLightFilter];
     _globals.stage.addChild(backgroundSprite);

   // create a background texture
    _globals.foregroundLightFilter = new PIXI.NormalMapFilter(PIXI.Texture.fromImage("foreground_n.png"));
    var foregroundSprite = PIXI.Sprite.fromImage("foreground.png");
    foregroundSprite.filters = [_globals.foregroundLightFilter];
     _globals.stage.addChild(foregroundSprite);

    // create a background texture
    _globals.objectLightFilter = new PIXI.NormalMapFilter(PIXI.Texture.fromImage("betty_n.png"));
    var objectSprite = PIXI.Sprite.fromImage("betty.png");
    objectSprite.filters = [_globals.objectLightFilter];
     _globals.stage.addChild(objectSprite);
*/

    lightSource = createLightSource(600,150);
    lightSource.color = {r:1.0, g:0.7, b:0.0, a:1.0};
    lightSource.shakeDelay = 10;
    lightSource.shakeDirection = 1;

    ambientLight = {};
    ambientLight.color = {r:0.3, g:0.3, b:0.3, a:1.0};

    createControls();

    function createControls()
    {
        var slide = new PIXI.Graphics();
        slide.beginFill(0x000000);
        slide.drawRect(0,0,_globals.viewWidth,24);
        slide.endFill();
        slide.alpha = 0.9;
        slide.position.y = _globals.viewHeight-24;
         _globals.stage.addChild(slide);

//        var text = new PIXI.Text("SpriteIlluminator demo", {font:"50px Arial", fill:"white"});
//        slide.addChild(text);

        text = new PIXI.Text("Point Light:", {font:"24px Arial", fill:"white"});
        text.position.y = 0;
        slide.addChild(text);

        createLightButton(slide, lightSource, 1.0, 1.0, 1.0, text.position.x + text.width + 20 +   0, text.position.y+24/2);
        createLightButton(slide, lightSource, 1.0, 0.0, 0.0, text.position.x + text.width + 20 +  30, text.position.y+24/2);
        createLightButton(slide, lightSource, 0.0, 1.0, 0.0, text.position.x + text.width + 20 +  60, text.position.y+24/2);
        createLightButton(slide, lightSource, 0.0, 0.0, 1.0, text.position.x + text.width + 20 +  90, text.position.y+24/2);
        createLightButton(slide, lightSource, 1.0, 1.0, 0.0, text.position.x + text.width + 20 + 120, text.position.y+24/2);
        createLightButton(slide, lightSource, 1.0, 0.7, 0.0, text.position.x + text.width + 20 + 150, text.position.y+24/2);

        text = new PIXI.Text("Ambient Light:", {font:"24px Arial", fill:"white"});
        text.position.y = 0;
        text.position.x = 500;
        slide.addChild(text);

        createLightButton(slide, ambientLight, 0.3, 0.3, 0.3, text.position.x + text.width + 20 +   0, text.position.y+24/2);
        createLightButton(slide, ambientLight, 0.5, 0.5, 0.5, text.position.x + text.width + 20 +  30, text.position.y+24/2);
        createLightButton(slide, ambientLight, 0.5, 0.0, 0.0, text.position.x + text.width + 20 +  60, text.position.y+24/2);
        createLightButton(slide, ambientLight, 0.0, 0.5, 0.0, text.position.x + text.width + 20 +  90, text.position.y+24/2);
        createLightButton(slide, ambientLight, 0.0, 0.0, 0.5, text.position.x + text.width + 20 + 120, text.position.y+24/2);
        createLightButton(slide, ambientLight, 0.0, 0.0, 0.0, text.position.x + text.width + 20 + 150, text.position.y+24/2);
    }


    function createLightButton(slide, light, red, green, blue, x, y)
    {
        var button = new PIXI.Graphics();
        slide.addChild(button);
        button.lineStyle ( 0 , ((255*red)&255)*0x10000 + ((255*green)&255)*0x100 + ((255*blue)&255),  1);
        button.beginFill(((255*red)&255)*0x10000 + ((255*green)&255)*0x100 + ((255*blue)&255));
        button.drawCircle(0,0,10);
        button.endFill();
        button.position.x = x;
        button.position.y = y;
        button.setInteractive(true);
        button.hitArea = new PIXI.Circle(0, 0, 10);
        button.buttonMode = true;
        button.lightSource = light;
        button.id = "color_controls";
        button.click = button.tap = function(data)
        {
            var item;
            var _lineColor;
            var fillColor = this.graphicsData[0].fillColor;
            var lineColor = this.lineColor;

            // clearing the stroke from the other controls
            for(var i=0;i<this.parent.children.length;i++){
                item = this.parent.children[i];
                if(item.id === "color_controls") {
                    _lineColor = item.graphicsData[0].fillColor;
                    item.clear();
                    item.lineStyle ( 0 , _lineColor,  1);
                    item.beginFill(_lineColor);
                    item.drawCircle(0,0,10);
                    item.endFill();
                    _lineColor = null;
                }
                else {
                    //continue;
                }
            }

            this.clear();
            this.lineStyle ( 2 , 0xffffff,  1);
            this.beginFill(fillColor);
            this.drawCircle(0,0,10);
            this.endFill();
            this.lightSource.color = {r:red, g:green, b:blue, a:1.0};
            this.lightSource.tint = fillColor;
            this.lineWidth = 2;
            button.endFill();
        };

        return button;
    }


    function createLightSource(x, y)
    {
        var lightSource = new PIXI.Sprite.fromImage("light.png");

        lightSource.interactive = true;
        lightSource.buttonMode = true;

        lightSource.anchor.x = 0.5;
        lightSource.anchor.y = 0.5;

        lightSource.mousedown = lightSource.touchstart = function(data)
        {
            this.setTexture(_globals.lightImage);
            lightSource.shakeDirection = 0;

            this.data = data;
            this.alpha = 0.9;
            this.dragging = true;
            this.sx = this.data.getLocalPosition(lightSource).x * lightSource.scale.x;
            this.sy = this.data.getLocalPosition(lightSource).y * lightSource.scale.y;
        };

        lightSource.mouseup = lightSource.mouseupoutside = lightSource.touchend = lightSource.touchendoutside = function(data)
        {
            this.alpha = 1
            this.dragging = false;
            // set the interaction data to null
            this.data = null;
        };

        lightSource.mousemove = lightSource.touchmove = function(data)
        {
            if(this.dragging)
            {
                // need to get parent coords..
                var newPosition = this.data.getLocalPosition(this.parent);
                // this.position.x = newPosition.x;
                // this.position.y = newPosition.y;
                this.position.x = newPosition.x - this.sx;
                this.position.y = newPosition.y - this.sy;
            }
        };

        // move the sprite to its designated position
        lightSource.position.x = x;
        lightSource.position.y = y;

        lightSource.color = {};

        // add it to the stage
         _globals.stage.addChild(lightSource);

        return lightSource;
    }

    requestAnimationFrame(animate);

    function animate()
    {
        var mouse =  _globals.stage.interactionManager.mouse;

        lightSource.shakeDelay--;
        if(lightSource.shakeDelay <0)
        {
            lightSource.rotation += lightSource.shakeDirection * 0.1;            

            if(lightSource.rotation > 0.2)
            {
                lightSource.shakeDirection = -1;
            }
            else if(lightSource.rotation < -0.2)
            {
                lightSource.shakeDirection = 1;
            }

            if((lightSource.rotation > -0.01) && (lightSource.rotation < 0.01) && lightSource.shakeDirection==1)
            {
                lightSource.shakeDelay = 250;                
            }
        }


        var lightPos = lightSource.position;
        var lightColor = lightSource.color;

        if( lightPos.x < 0) lightPos.x = 0;
        else if( lightPos.x > _globals.viewWidth) lightPos.x = _globals.viewWidth;

        if( lightPos.y < 0) lightPos.y = 0;
        else if( lightPos.y > _globals.viewHeight) lightPos.y = _globals.viewHeight;

        _globals.backgroundLightFilter.uniforms.LightPos.value[0] = lightPos.x;
        _globals.backgroundLightFilter.uniforms.LightPos.value[1] = lightPos.y;
        _globals.backgroundLightFilter.uniforms.LightColor.value[0] = lightColor.r;
        _globals.backgroundLightFilter.uniforms.LightColor.value[1] = lightColor.g;
        _globals.backgroundLightFilter.uniforms.LightColor.value[2] = lightColor.b;
        _globals.backgroundLightFilter.uniforms.LightColor.value[3] = lightColor.a;
        _globals.backgroundLightFilter.uniforms.AmbientColor.value[0] = ambientLight.color.r;
        _globals.backgroundLightFilter.uniforms.AmbientColor.value[1] = ambientLight.color.g;
        _globals.backgroundLightFilter.uniforms.AmbientColor.value[2] = ambientLight.color.b;
        _globals.backgroundLightFilter.uniforms.AmbientColor.value[3] = ambientLight.color.a;

        /*
        _globals.objectLightFilter.uniforms.LightPos.value[0] = lightPos.x;
        _globals.objectLightFilter.uniforms.LightPos.value[1] = lightPos.y;
        _globals.objectLightFilter.uniforms.LightColor.value[0] = lightColor.r;
        _globals.objectLightFilter.uniforms.LightColor.value[1] = lightColor.g;
        _globals.objectLightFilter.uniforms.LightColor.value[2] = lightColor.b;
        _globals.objectLightFilter.uniforms.LightColor.value[3] = lightColor.a;
        _globals.objectLightFilter.uniforms.AmbientColor.value[0] = ambientLight.color.r;
        _globals.objectLightFilter.uniforms.AmbientColor.value[1] = ambientLight.color.g;
        _globals.objectLightFilter.uniforms.AmbientColor.value[2] = ambientLight.color.b;
        _globals.objectLightFilter.uniforms.AmbientColor.value[3] = ambientLight.color.a;



        _globals.foregroundLightFilter.uniforms.LightPos.value[0] = lightPos.x;
        _globals.foregroundLightFilter.uniforms.LightPos.value[1] = lightPos.y;
        _globals.foregroundLightFilter.uniforms.LightColor.value[0] = lightColor.r;
        _globals.foregroundLightFilter.uniforms.LightColor.value[1] = lightColor.g;
        _globals.foregroundLightFilter.uniforms.LightColor.value[2] = lightColor.b;
        _globals.foregroundLightFilter.uniforms.LightColor.value[3] = lightColor.a;
        _globals.foregroundLightFilter.uniforms.AmbientColor.value[0] = ambientLight.color.r;
        _globals.foregroundLightFilter.uniforms.AmbientColor.value[1] = ambientLight.color.g;
        _globals.foregroundLightFilter.uniforms.AmbientColor.value[2] = ambientLight.color.b;
        _globals.foregroundLightFilter.uniforms.AmbientColor.value[3] = ambientLight.color.a;
*/

        _globals.renderer.render( _globals.stage);

        requestAnimationFrame( animate );
    }

};