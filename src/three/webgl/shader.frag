uniform float iGlobalTime;
uniform vec2 iResolution;
uniform vec4 iMouse;
uniform float audio1;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

#define R(p, a) p = p * cos(a) + vec2(-p.y, p.x) * sin(a)
#define time iGlobalTime*0.1
#define tau 6.2831853

mat2 makem2(in float theta){float c = cos(theta);float s = sin(theta);return mat2(c,-s,s,c);}
float noise( in vec2 x ){return texture2D(iChannel0, x*.01).x;}
mat2 m2 = mat2( .80,  0.60, -0.80,  0.80 );

float grid(vec2 p)
{
  float s = sin(p.x)*cos(p.y);
  return s;
}

float flow(in vec2 p)
{
  float z=4.;
  float rz = 0.;
  vec2 bp = p;
  for (float i= 1.;i < 7.;i++ )
  {
    bp += time*1.5;
    vec2 gr = vec2(grid(p*3.-time*2.),grid(p*3.+4.-time*2.))*0.4;
    gr = normalize(gr)*0.4;
    gr *= makem2((p.x+p.y)*.3+time*10.);
    p += gr*0.5;

    rz+= (sin(noise(p)*2.)*0.5+0.5) /z;

    p = mix(bp,p,.5);
    z *= 1.7;
    p *= 2.5;
    p*=m2;
    bp *= 2.5;
    bp*=m2;
  }
  return rz;
}

float spiral(vec2 p,float scl)
{
  float r = length(p);
  r = log(r);
  float a = atan(p.y, p.y);
  return abs(mod(scl*(r-2./scl*a),tau)-1.)*1.;
}


float Sin01(float t, vec2 p) {
    return .5 + cos(t)*p.y*4.5 * sin(6.28319 * t) * p.x * p.y;
}

float SineEggCarton(vec3 p) {
    return .1 + abs(sin(p.x) - cos(p.y) + sin(p.z)) * 1.2;
}


float Map(vec3 p, float scale) {
    float dSphere = length(p) - 1.0;
    return max(dSphere, (.85 - SineEggCarton(scale * p)) / scale);
}

vec3 GetColor(vec3 p) {
    float amount = clamp((1.5 - length(p)) / 2.0, 0.0, 1.0);
    vec3 col = 0.5 + 0.5 * cos(6.28319 * (vec3(0.2, 0.0, 0.0) + amount * (audio1*.6) * vec3(1.0, 1.0, 0.5)));
    return col * amount;
}

void main() {


  vec2 p = gl_FragCoord.xy / iResolution.xy-0.5;
  p.x *= iResolution.x/iResolution.y;
  p*= 1.;
  p.y-=.15;
  float rz = flow(p);
  p /= exp(mod(2.1,2.1));
  rz *= (3.8-spiral(p,.5))*5.5 * audio1; // intensity / thickness of ring
  vec3 col = vec3(.02,0.04,0.09)/rz; // colors
  col=pow(abs(col),vec3(1.01));
  //gl_FragColor = vec4(col,1.0);


  p = gl_FragCoord.xy / iResolution.xy-0.5;
  p.x *= iResolution.x/iResolution.y;
  p*= 1.;
  p.y+=.8;
  rz = flow(p);
  p /= exp(mod(2.1,2.1));
  rz *= (3.0-spiral(p,.5))*.9 * audio1; // intensity / thickness of ring
  col = vec3(.02,0.04,0.09)/rz; // colors
  col=pow(abs(col),vec3(1.01));
  gl_FragColor+= vec4(col,1.0);




  vec3 rd = normalize(vec3(2.0 * gl_FragCoord.xy - iResolution.xy, -iResolution.y));
    vec3 ro = vec3(0.0, 0.0, mix(2.5, 2.0, Sin01(0.05 * iGlobalTime,p)));
    R(rd.xz, 0.2 * iGlobalTime);
    R(ro.xz, 0.2 * iGlobalTime);
    R(rd.yz, 0.1 * iGlobalTime);
    R(ro.yz, 0.1 * iGlobalTime);
    float t = 0.0;
   // gl_FragColor.rgb = vec3(0.0);
    float scale = mix(3.5, 40.0, Sin01(0.068 * iGlobalTime*.02,p/iGlobalTime));
    for (int i = 0; i < 64; i++) {
        vec3 p = ro + t * rd;
        float d = Map(p, scale);
        if (t > 5.0 || d < 0.001) {
            //break;
            gl_FragColor.rgb -= 0.05 * GetColor(p) * (audio1*.6);
            break;
        }
        t += 0.8 * d;
        gl_FragColor.rgb += 0.05 * GetColor(p) * (audio1*.6);
    }


}