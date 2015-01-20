PIXI.NormalMapFilter = function(texture)
{
	PIXI.AbstractFilter.call( this );
	
	this.passes = [this];
	//texture.baseTexture._powerOf2 = true;

	// set the uniforms
	//console.log()
	this.uniforms = {
		normalMap:          {type: 'sampler2D', value:texture},
		mapDimensions:      {type: '2f', value:{x:1, y:1}},
		dimensions:         {type: '4fv', value:[0,0,0,0]},

		LightPos: {type: '3fv', value:[0, 0, 0.2]},
        LightColor: {type: '4fv', value:[1,1,1,1]},
        AmbientColor: {type: '4fv', value:[0.5,0.5,0.5,1]}
	};

	if(texture.baseTexture.hasLoaded)
	{
		this.uniforms.mapDimensions.value.x = texture.width;
		this.uniforms.mapDimensions.value.y = texture.height;
	}
	else
	{
		this.boundLoadedFunction = this.onTextureLoaded.bind(this);
		texture.baseTexture.on("loaded", this.boundLoadedFunction);
	}

	this.fragmentSrc = [
        "precision highp float;",

        "varying vec2 vTextureCoord;",

        "uniform sampler2D normalMap;",
        "uniform sampler2D uSampler;",
        "uniform vec4 LightColor;",
        "uniform vec4 AmbientColor;",

        "uniform vec3 LightPos;",
        "uniform vec2 mapDimensions;",

        "const vec2 Resolution = vec2(1.0,1.0);",      //resolution of screen

        "void main(void) {",

            "vec4 DiffuseColor = texture2D(uSampler, vTextureCoord);",

            "vec2 mapCords = vec2(vTextureCoord.x, 1.0-vTextureCoord.y);", // flip
            "vec3 NormalMap = texture2D(normalMap, mapCords).rgb;",

            "vec2 LightPosMapped = vec2(LightPos.x/mapDimensions.x, 1.0 - LightPos.y/mapDimensions.y);",

            "vec3 LightDir = vec3((LightPosMapped.xy - vTextureCoord.xy), LightPos.z);",

            "float D = length(LightDir);",

            "vec3 Ambient = AmbientColor.rgb * AmbientColor.a;",

            "vec3 N = normalize(NormalMap * 2.0 - 1.0);",
            "vec3 L = normalize(LightDir);",

            "vec3 Diffuse = (LightColor.rgb * LightColor.a) * max(dot(N, L), 0.0);",

            "float Brightness = 1.0 / (0.3 + 2.0*D);",
            "vec3 Intensity = Ambient + Diffuse * Brightness;",

            "vec3 FinalColor = DiffuseColor.rgb * Intensity;",

            "gl_FragColor = vec4(FinalColor, DiffuseColor.a);",

//            "gl_FragColor = DiffuseColor;", // display diffuse only
//            "gl_FragColor = vec4(NormalMap, 1.0);", // display normalmap only

//            "D = length(LightPosNormalized.xy - vTextureCoord.xy);",
//            "gl_FragColor = vec4(1.0-D, 1.0-D, 1.0-D, 1.0);", // display diffuse only

        "}"
	];
	
}


PIXI.NormalMapFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.NormalMapFilter.prototype.constructor = PIXI.NormalMapFilter;

PIXI.NormalMapFilter.prototype.onTextureLoaded = function()
{
	this.uniforms.mapDimensions.value.x = this.uniforms.normalMap.value.width;
	this.uniforms.mapDimensions.value.y = this.uniforms.normalMap.value.height;

	this.uniforms.normalMap.value.baseTexture.off("loaded", this.boundLoadedFunction)

};
