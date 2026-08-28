struct Params {
  time: f32,
  texel: vec2f,
}

@group(0) @binding(0) var<uniform> params: Params;

fn hash21(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453);
}

fn streams(p: vec2f, t: f32) -> f32 {
  var acc = 0.0;
  for (var i = 0; i < 4; i = i + 1) {
    let fi = f32(i);
    let y0 = -0.26 + fi * 0.17;
    let wave = y0 + 0.028 * sin(p.x * (4.8 + fi) + t * 0.22 + fi);
    let d = abs(p.y - wave);
    acc += (1.0 - smoothstep(0.0, 0.0026, d)) * (0.22 - fi * 0.025);
  }
  return acc;
}

fn rings(p: vec2f, t: f32) -> f32 {
  let center = vec2f(0.28 + sin(t * 0.18) * 0.02, -0.08);
  let d = length((p - center) * vec2f(1.0, 1.35));
  let first = 1.0 - smoothstep(0.0, 0.004, abs(d - 0.18));
  let second = 1.0 - smoothstep(0.0, 0.003, abs(d - 0.27));
  return first * 0.18 + second * 0.1;
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let aspect = params.texel.y / max(params.texel.x, 1.0e-6);
  let p = (uv - vec2f(0.5)) * vec2f(aspect, 1.0);
  let t = params.time;

  let flow = streams(p, t);
  let orbit = rings(p, t);
  let cell = floor(uv * vec2f(30.0, 16.0));
  let seed = hash21(cell);
  let pulse = 0.5 + 0.5 * sin(t * 1.4 + seed * 30.0);
  let point = step(0.976, seed) * pulse;
  let rightFade = smoothstep(0.24, 0.78, uv.x);
  let edgeFade = smoothstep(0.02, 0.14, uv.y) * smoothstep(0.98, 0.82, uv.y);

  var alpha = (flow + orbit + point * 0.08) * rightFade * edgeFade;
  alpha = clamp(alpha, 0.0, 0.22);

  let blue = vec3f(0.184, 0.498, 0.969);
  let teal = vec3f(0.149, 0.749, 0.694);
  let coral = vec3f(0.949, 0.373, 0.529);
  let color = mix(mix(blue, teal, uv.y), coral, point * 0.65);

  return vec4f(color * alpha, alpha);
}
