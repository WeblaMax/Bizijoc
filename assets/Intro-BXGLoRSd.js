import{r as e}from"./rolldown-runtime-XKyaHtl9.js";import{a as t,c as n,i as r,o as i,s as a,t as o}from"./index-D2YxhWmn.js";import{_ as s,a as c,d as l,f as u,g as d,h as f,i as p,m,n as h,o as g,p as _,r as ee,s as v,t as y}from"./House-2ZA0HmGP.js";import{B as te,E as b,F as ne,G as x,H as S,L as C,T as re,U as w,W as T,_ as E,b as D,c as ie,g as ae,h as O,i as k,j as oe,o as A,p as j,s as se,t as M,u as ce,v as N,w as P,z as F}from"./three-DacGU4_U.js";var le=parseInt(`187`.replace(/\D+/g,``)),I=le>=125?`uv1`:`uv2`,L=new k,R=new w,ue=class extends ae{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type=`LineSegmentsGeometry`,this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute(`position`,new O([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute(`uv`,new O([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new E(t,6,1);return this.setAttribute(`instanceStart`,new N(n,3,0)),this.setAttribute(`instanceEnd`,new N(n,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));let r=new E(n,t*2,1);return this.setAttribute(`instanceColorStart`,new N(r,t,0)),this.setAttribute(`instanceColorEnd`,new N(r,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new x(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new k);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),L.setFromBufferAttribute(t),this.boundingBox.union(L))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new F),this.boundingBox===null&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let r=0;for(let i=0,a=e.count;i<a;i++)R.fromBufferAttribute(e,i),r=Math.max(r,n.distanceToSquared(R)),R.fromBufferAttribute(t,i),r=Math.max(r,n.distanceToSquared(R));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error(`THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.`,this)}}toJSON(){}applyMatrix(e){return console.warn(`THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4().`),this.applyMatrix4(e)}},de=class extends ue{constructor(){super(),this.isLineGeometry=!0,this.type=`LineGeometry`}setPositions(e){let t=e.length-3,n=new Float32Array(2*t);for(let r=0;r<t;r+=3)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];return super.setPositions(n),this}setColors(e,t=3){let n=e.length-t,r=new Float32Array(2*n);if(t===3)for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5];else for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5],r[2*i+6]=e[i+6],r[2*i+7]=e[i+7];return super.setColors(r,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}},fe=class extends C{constructor(e){super({type:`LineMaterial`,uniforms:te.clone(te.merge([M.common,M.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new S(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${le>=154?`colorspace_fragment`:`encodings_fragment`}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA=`1`:delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return`WORLD_UNITS`in this.defines},set:function(e){e===!0?this.defines.WORLD_UNITS=``:delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return`USE_DASH`in this.defines},set(e){!!e!=`USE_DASH`in this.defines&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH=``:delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return`USE_ALPHA_TO_COVERAGE`in this.defines},set:function(e){!!e!=`USE_ALPHA_TO_COVERAGE`in this.defines&&(this.needsUpdate=!0),e===!0?(this.defines.USE_ALPHA_TO_COVERAGE=``,this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}},pe=new T,me=new w,he=new w,z=new T,B=new T,V=new T,ge=new w,_e=new re,H=new D,ve=new w,U=new k,W=new F,G=new T,K,q;function ye(e,t,n){return G.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),G.multiplyScalar(1/G.w),G.x=q/n.width,G.y=q/n.height,G.applyMatrix4(e.projectionMatrixInverse),G.multiplyScalar(1/G.w),Math.abs(Math.max(G.x,G.y))}function be(e,t){let n=e.matrixWorld,r=e.geometry,i=r.attributes.instanceStart,a=r.attributes.instanceEnd,o=Math.min(r.instanceCount,i.count);for(let r=0,s=o;r<s;r++){H.start.fromBufferAttribute(i,r),H.end.fromBufferAttribute(a,r),H.applyMatrix4(n);let o=new w,s=new w;K.distanceSqToSegment(H.start,H.end,s,o),s.distanceTo(o)<q*.5&&t.push({point:s,pointOnLine:o,distance:K.origin.distanceTo(s),object:e,face:null,faceIndex:r,uv:null,[I]:null})}}function xe(e,t,n){let r=t.projectionMatrix,i=e.material.resolution,a=e.matrixWorld,o=e.geometry,s=o.attributes.instanceStart,c=o.attributes.instanceEnd,l=Math.min(o.instanceCount,s.count),u=-t.near;K.at(1,V),V.w=1,V.applyMatrix4(t.matrixWorldInverse),V.applyMatrix4(r),V.multiplyScalar(1/V.w),V.x*=i.x/2,V.y*=i.y/2,V.z=0,ge.copy(V),_e.multiplyMatrices(t.matrixWorldInverse,a);for(let t=0,o=l;t<o;t++){if(z.fromBufferAttribute(s,t),B.fromBufferAttribute(c,t),z.w=1,B.w=1,z.applyMatrix4(_e),B.applyMatrix4(_e),z.z>u&&B.z>u)continue;if(z.z>u){let e=z.z-B.z,t=(z.z-u)/e;z.lerp(B,t)}else if(B.z>u){let e=B.z-z.z,t=(B.z-u)/e;B.lerp(z,t)}z.applyMatrix4(r),B.applyMatrix4(r),z.multiplyScalar(1/z.w),B.multiplyScalar(1/B.w),z.x*=i.x/2,z.y*=i.y/2,B.x*=i.x/2,B.y*=i.y/2,H.start.copy(z),H.start.z=0,H.end.copy(B),H.end.z=0;let o=H.closestPointToPointParameter(ge,!0);H.at(o,ve);let l=P.lerp(z.z,B.z,o),d=l>=-1&&l<=1,f=ge.distanceTo(ve)<q*.5;if(d&&f){H.start.fromBufferAttribute(s,t),H.end.fromBufferAttribute(c,t),H.start.applyMatrix4(a),H.end.applyMatrix4(a);let r=new w,i=new w;K.distanceSqToSegment(H.start,H.end,i,r),n.push({point:i,pointOnLine:r,distance:K.origin.distanceTo(i),object:e,face:null,faceIndex:t,uv:null,[I]:null})}}}var Se=class extends b{constructor(e=new ue,t=new fe({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type=`LineSegments2`}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,i=0,a=t.count;e<a;e++,i+=2)me.fromBufferAttribute(t,e),he.fromBufferAttribute(n,e),r[i]=i===0?0:r[i-1],r[i+1]=r[i]+me.distanceTo(he);let i=new E(r,2,1);return e.setAttribute(`instanceDistanceStart`,new N(i,1,0)),e.setAttribute(`instanceDistanceEnd`,new N(i,1,1)),this}raycast(e,t){let n=this.material.worldUnits,r=e.camera;r===null&&!n&&console.error(`LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.`);let i=e.params.Line2===void 0?0:e.params.Line2.threshold||0;K=e.ray;let a=this.matrixWorld,o=this.geometry,s=this.material;q=s.linewidth+i,o.boundingSphere===null&&o.computeBoundingSphere(),W.copy(o.boundingSphere).applyMatrix4(a);let c;if(c=n?q*.5:ye(r,Math.max(r.near,W.distanceToPoint(K.origin)),s.resolution),W.radius+=c,K.intersectsSphere(W)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),U.copy(o.boundingBox).applyMatrix4(a);let l;l=n?q*.5:ye(r,Math.max(r.near,U.distanceToPoint(K.origin)),s.resolution),U.expandByScalar(l),K.intersectsBox(U)!==!1&&(n?be(this,t):xe(this,r,t))}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(pe),this.material.uniforms.resolution.value.set(pe.z,pe.w))}},Ce=class extends Se{constructor(e=new de,t=new fe({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type=`Line2`}},J=e(n()),we=J.forwardRef(function({points:e,color:t=16777215,vertexColors:n,linewidth:r,lineWidth:i,segments:a,dashed:o,...c},l){var u;let d=s(e=>e.size),f=J.useMemo(()=>a?new Se:new Ce,[a]),[p]=J.useState(()=>new fe),h=(n==null||(u=n[0])==null?void 0:u.length)===4?4:3,g=J.useMemo(()=>{let r=a?new ue:new de,i=e.map(e=>{let t=Array.isArray(e);return e instanceof w||e instanceof T?[e.x,e.y,e.z]:e instanceof S?[e.x,e.y,0]:t&&e.length===3?[e[0],e[1],e[2]]:t&&e.length===2?[e[0],e[1],0]:e});if(r.setPositions(i.flat()),n){t=16777215;let e=n.map(e=>e instanceof ce?e.toArray():e);r.setColors(e.flat(),h)}return r},[e,a,n,h]);return J.useLayoutEffect(()=>{f.computeLineDistances()},[e,f]),J.useLayoutEffect(()=>{o?p.defines.USE_DASH=``:delete p.defines.USE_DASH,p.needsUpdate=!0},[o,p]),J.useEffect(()=>()=>{g.dispose(),p.dispose()},[g]),J.createElement(`primitive`,m({object:f,ref:l},c),J.createElement(`primitive`,{object:g,attach:`geometry`}),J.createElement(`primitive`,m({object:p,attach:`material`,color:t,vertexColors:!!n,resolution:[d.width,d.height],linewidth:r??i??1,dashed:o,transparent:h===4},c)))}),Te=J.forwardRef(({threshold:e=15,geometry:t,...n},r)=>{let i=J.useRef(null);J.useImperativeHandle(r,()=>i.current,[]);let a=J.useMemo(()=>[0,0,0,1,0,0],[]),o=J.useRef(null),s=J.useRef(null);return J.useLayoutEffect(()=>{let n=i.current.parent,r=t??n?.geometry;if(!r||o.current===r&&s.current===e)return;o.current=r,s.current=e;let a=new j(r,e).attributes.position.array;i.current.geometry.setPositions(a),i.current.geometry.attributes.instanceStart.needsUpdate=!0,i.current.geometry.attributes.instanceEnd.needsUpdate=!0,i.current.computeLineDistances()}),J.createElement(we,m({segments:!0,points:a,ref:i,raycast:()=>null},n))}),Y=a(),X=90,Ee=`
  attribute float aAge;
  attribute float aSize;
  uniform float uPx;
  varying float vAge;
  void main() {
    vAge = aAge;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (1.0 + aAge * 2.2) * uPx / max(0.1, -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`,De=`
  varying float vAge;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = smoothstep(0.5, 0.0, d) * (1.0 - vAge) * 0.42;
    if (vAge >= 1.0 || a < 0.003) discard;
    gl_FragColor = vec4(mix(vec3(1.0, 0.72, 0.4), vec3(0.62, 0.56, 0.5), vAge), a);
  }
`,Oe=(0,J.forwardRef)(function(e,t){let n=(0,J.useRef)(),r=s(e=>e.size),i=s(e=>e.viewport.dpr),a=(0,J.useMemo)(()=>{let e=new se;return e.setAttribute(`position`,new A(new Float32Array(270),3)),e.setAttribute(`aAge`,new A(new Float32Array(X).fill(1),1)),e.setAttribute(`aSize`,new A(new Float32Array(X),1)),{geo:e,vel:new Float32Array(270),life:new Float32Array(X).fill(1),age:new Float32Array(X).fill(1),next:0}},[]),o=(0,J.useMemo)(()=>new C({vertexShader:Ee,fragmentShader:De,transparent:!0,depthWrite:!1,uniforms:{uPx:{value:600}}}),[]);return o.uniforms.uPx.value=r.height*i*.09,(0,J.useImperativeHandle)(t,()=>({emit(e){let t=a.next++%X;a.geo.attributes.position.setXYZ(t,e.x,e.y,e.z),a.vel[t*3]=(Math.random()-.5)*.25,a.vel[t*3+1]=.25+Math.random()*.35,a.vel[t*3+2]=.15+Math.random()*.25,a.age[t]=0,a.life[t]=.7+Math.random()*.5,a.geo.attributes.aSize.setX(t,.5+Math.random()*.5)}})),d((e,t)=>{let n=a.geo.attributes.position,r=a.geo.attributes.aAge,i=!1;for(let e=0;e<X;e++)a.age[e]>=1||(i=!0,a.age[e]+=t/a.life[e],n.setXYZ(e,n.getX(e)+a.vel[e*3]*t,n.getY(e)+a.vel[e*3+1]*t,n.getZ(e)+a.vel[e*3+2]*t),r.setX(e,Math.min(1,a.age[e])));i&&(n.needsUpdate=!0,r.needsUpdate=!0,a.geo.attributes.aSize.needsUpdate=!0)}),(0,Y.jsx)(`points`,{ref:n,geometry:a.geo,material:o,frustumCulled:!1,renderOrder:5})}),Z=1.5,Q=Z/2,ke=.62,Ae=1.7,je=[{n:[0,0,1],ry:0},{n:[-1,0,0],ry:-Math.PI/2},{n:[0,0,-1],ry:Math.PI},{n:[1,0,0],ry:Math.PI/2}],Me=e=>e*e*(3-2*e),Ne=e=>Math.min(1,Math.max(0,e)),$=new w;function Pe({progressRef:e,labelRef:t,fadeRef:n,onReveal:a,onFinish:o,skipRef:f}){let{camera:m,size:te,gl:b}=s(),x=(0,J.useRef)({shown:0,started:!1,idleAmp:.32,theta:-.6,split:0,sign:0,pieceP:[],dolly:0,fade:0}).current,S=(0,J.useRef)({on:!1,y:Q,vy:0,sq:0,sqv:0,lift:0}).current,C=(0,J.useRef)(),re=(0,J.useRef)([]),T=(0,J.useRef)(),E=(0,J.useRef)(),D=(0,J.useRef)([]),ae=(0,J.useRef)([]),O=(0,J.useRef)([]),k=(0,J.useRef)(0),A=(0,J.useRef)(),j=(0,J.useMemo)(()=>new oe(new w(0,-1,0),0),[]),se=(0,J.useMemo)(()=>{let e=r(`#ffffff`).clone();return e.clippingPlanes=[j],e.side=2,e},[j]);(0,J.useEffect)(()=>{b.localClippingEnabled=!0},[b]);let M=(0,J.useMemo)(()=>l.map((e,t)=>{let n=document.createElement(`canvas`);n.width=n.height=256;let r=new ie(n);return r.colorSpace=ne,{canvas:n,tex:r,last:-1,ch:e.ch,face:je[t]}}),[]),ce=(0,J.useCallback)(e=>{D.current=e,x.pieceP=e.map(()=>0),e.forEach((e,t)=>{e.visible=!1,e.userData.dir=new w((t*37%7-3)*.7,1.5+t%3*.9,-(5+t%4*.8)),e.userData.spin=new w((t*13%5-2)*.5,(t*7%5-2)*.6,(t*11%5-2)*.4)})},[x]),N=(0,J.useCallback)(e=>{let t=D.current[e];if(!t)return;let n=ae.current.find(e=>!e.userData.busy);if(t.getWorldPosition($),i.fromTo(t.scale,{x:1.05,y:.94,z:1.05},{x:1,y:1,z:1,duration:.22,ease:`elastic.out(1.2,0.4)`}),!n)return;let r=n;r.userData.busy=!0,r.position.copy($),r.quaternion.copy(m.quaternion),r.visible=!0,r.material.opacity=.75,r.scale.setScalar(.5),i.to(r.scale,{x:2.4,y:2.4,z:2.4,duration:.38,ease:`power2.out`}),i.to(r.material,{opacity:0,duration:.38,ease:`power1.in`,onComplete:()=>{r.visible=!1,r.userData.busy=!1}})},[m]),F=(0,J.useRef)(null),le=(0,J.useCallback)(()=>{let e=x.pieceP.length,t=i.timeline({onComplete:o});F.current=t,t.to(S,{lift:1,duration:.22,ease:`power2.in`,onComplete:()=>{S.on=!0,S.y=5.8,S.vy=0}},0),t.to(x,{idleAmp:0,duration:.22},0),t.to(x,{theta:0,duration:.9,ease:`none`},.22),t.to(x,{theta:Math.PI*2,duration:1.4,ease:`power1.inOut`},1.05),t.to(x,{split:1,duration:.55,ease:`back.out(1.5)`},2.45);for(let n=0;n<e;n++)t.to(x.pieceP,{[n]:1,duration:.36,ease:`back.out(1.5)`,onComplete:()=>N(n)},2.5+n*.075);t.to(x,{sign:1,duration:.75,ease:`power3.inOut`},2.9),t.to(x,{dolly:1,duration:1,ease:`power2.inOut`},3.75),t.call(()=>a?.(),null,4.35),t.to(x,{fade:1,duration:.45,ease:`power1.in`},4.4)},[x,S,N,o,a]);(0,J.useEffect)(()=>{f&&(f.current=()=>F.current?.kill())},[f]),(0,J.useEffect)(()=>()=>F.current?.kill(),[]);let I=(0,J.useMemo)(()=>new w,[]),L=(0,J.useMemo)(()=>new w,[]);return d((r,i)=>{let a=Math.min(i,.05);k.current+=a;let o=k.current;if(!x.started){let n=e.current;x.shown=Math.min(n,x.shown+a/1);let r=.02+x.shown*1.55;j.constant=r,t.current&&(t.current.textContent=`Pregătim atelierul… ${Math.round(x.shown*100)}%`),x.shown>=1&&(x.started=!0,j.constant=10,t.current&&(t.current.style.opacity=0),le())}let s=te.width/te.height,l=P.clamp(1.85/(Math.tan(P.degToRad(20))*s),8.2,13);I.set(0,1.45,l);let d=x.dolly;m.position.set(0,P.lerp(I.y,.62,d),P.lerp(I.z,-.25,d)),L.set(0,P.lerp(1.25,.6,d),P.lerp(0,-2,d)),m.lookAt(L);let f=P.lerp(40,64,d*d);m.fov!==f&&(m.fov=f,m.updateProjectionMatrix());let h=C.current;if(S.on&&(S.vy-=26*a,S.y+=S.vy*a,S.y<Q)){let e=-S.vy;S.y=Q,S.vy=e>1.6?e*.42:0,e>1.6&&(S.sqv=-e*.55)}S.sqv+=(-S.sq*220-S.sqv*11)*a,S.sq+=S.sqv*a;let _=S.y;!S.on&&S.lift>0&&(_=Q+5.55*S.lift);let ee=x.theta+Math.sin(o*1.4)*x.idleAmp;if(h){h.position.set(0,_,Ae),h.rotation.y=ee;let e=P.clamp(S.sq,-.18,.18);h.scale.set(1-e*.55,1+e,1-e*.55);let t=Ne(1-x.split*3);h.visible=t>.01,h.scale.multiplyScalar(t)}if(E.current){let e=1/(1+Math.max(0,_-Q)*.5);E.current.position.set(0,.01,Ae),E.current.scale.setScalar(1.1*e*(1-x.split*0)),E.current.material.opacity=.85*e*(1-x.split)}M.forEach((e,t)=>{let n=Math.PI/2*t,r=Ne((x.theta-(n-.5))/.85);if(r!==e.last){if((r>0||e.last>0)&&(u(e.canvas,e.ch,r),e.tex.needsUpdate=!0),r>0&&r<1&&O.current[t]&&T.current){let e=O.current[t],n=.04+.92*r;for(let t=0;t<3;t++)$.set((Math.random()-.5)*Z*.5,(.5-n)*Z*.9,.01),e.localToWorld($),T.current.emit($)}e.last=r}});let v=Me(x.split),y=Me(x.sign);re.current.forEach((e,t)=>{if(!e)return;e.visible=x.split>.001;let n=(t-1.5)*.72,r=(t-1.5)*(1+p)*c,i=P.lerp(0,n,v),a=P.lerp(Q,ke/2,v)+Math.sin(v*Math.PI)*.5,o=Ae,s=P.lerp(i,r,y),l=P.lerp(a,g,y)+Math.sin(y*Math.PI)*.9,u=P.lerp(o,0,y);e.position.set(s,l,u);let d=P.lerp(P.lerp(.12,ke,v),c,y);e.scale.setScalar(d),e.rotation.y=(1-v)*(t%2?-1:1)*Math.PI+Math.sin(y*Math.PI)*.4*(t%2?-1:1),e.rotation.x=Math.sin(v*Math.PI)*.4}),D.current.forEach((e,t)=>{let n=x.pieceP[t]??0;if(e.visible=n>.001,!e.visible)return;let r=e.userData.rest,i=1-n;e.position.set(r.p.x+e.userData.dir.x*i,r.p.y+e.userData.dir.y*i,r.p.z+e.userData.dir.z*i),e.rotation.set(r.r.x+e.userData.spin.x*i,r.r.y+e.userData.spin.y*i,r.r.z+e.userData.spin.z*i)});let b=x.pieceP.length?x.pieceP.reduce((e,t)=>e+t,0)/x.pieceP.length:0,ne=A.current;ne&&(ne.material.opacity=.9*Ne(b)),n.current&&(n.current.style.opacity=x.fade)}),(0,Y.jsxs)(Y.Fragment,{children:[(0,Y.jsx)(`color`,{attach:`background`,args:[`#FBF1E1`]}),(0,Y.jsx)(ee,{interior:!0}),(0,Y.jsx)(`fog`,{attach:`fog`,args:[`#FBF1E1`,16,34]}),(0,Y.jsxs)(`group`,{ref:C,children:[(0,Y.jsx)(_,{args:[Z,Z,Z],radius:.12,smoothness:3,material:se}),je.map((e,t)=>(0,Y.jsxs)(`mesh`,{ref:e=>{O.current[t]=e},position:[e.n[0]*.754,0,e.n[2]*.754],rotation:[0,e.ry,0],children:[(0,Y.jsx)(`planeGeometry`,{args:[Z*.9,Z*.9]}),(0,Y.jsx)(`meshBasicMaterial`,{map:M[t].tex,transparent:!0,toneMapped:!1,polygonOffset:!0,polygonOffsetFactor:-2})]},t)),(0,Y.jsx)(Fe,{started:()=>x.started})]}),(0,Y.jsx)(v,{ref:E,size:2.8}),l.map((e,t)=>(0,Y.jsx)(h,{ref:e=>{re.current[t]=e},letter:e.ch,color:e.color,visible:!1},t)),(0,Y.jsx)(y,{onPieces:ce,shadow:!1}),(0,Y.jsx)(Ie,{innerRef:A}),Array.from({length:8}).map((e,t)=>(0,Y.jsxs)(`mesh`,{ref:e=>{ae.current[t]=e},visible:!1,renderOrder:6,children:[(0,Y.jsx)(`ringGeometry`,{args:[.16,.2,28]}),(0,Y.jsx)(`meshBasicMaterial`,{color:`#fff0cf`,transparent:!0,depthWrite:!1,side:2,toneMapped:!1})]},t)),(0,Y.jsx)(Oe,{ref:T})]})}function Fe({started:e}){let t=(0,J.useRef)();return d(()=>{t.current&&e()&&(t.current.visible=!1)}),(0,Y.jsx)(`group`,{ref:t,children:(0,Y.jsxs)(`mesh`,{children:[(0,Y.jsx)(`boxGeometry`,{args:[Z,Z,Z]}),(0,Y.jsx)(`meshBasicMaterial`,{color:`#d9bf97`,transparent:!0,opacity:.22,depthWrite:!1}),(0,Y.jsx)(Te,{color:`#b98f5a`})]})})}function Ie({innerRef:e}){return(0,Y.jsx)(v,{ref:e,size:5.2,position:[0,.003,0],opacity:0})}function Le({progressRef:e,onReveal:n,onDone:r}){let a=(0,J.useRef)(),s=(0,J.useRef)(),c=(0,J.useRef)(),l=(0,J.useRef)(),u=(0,J.useRef)(!1),d=(0,J.useCallback)(e=>{u.current||(u.current=!0,o(),n?.(),i.to(a.current,{opacity:0,duration:e?.35:.55,ease:`power1.out`,onComplete:r}))},[n,r]),p=(0,J.useCallback)(()=>d(!1),[d]);return(0,Y.jsxs)(`div`,{className:`intro`,ref:a,role:`dialog`,"aria-label":`Animație de introducere BiziJoc`,children:[(0,Y.jsx)(f,{dpr:[1,t()],camera:{fov:40,near:.05,far:60,position:[0,1.55,8]},gl:{antialias:!0,powerPreference:`high-performance`},children:(0,Y.jsx)(Pe,{progressRef:e,labelRef:s,fadeRef:c,onFinish:p,onReveal:n,skipRef:l})}),(0,Y.jsx)(`div`,{className:`intro__label`,ref:s,"aria-live":`polite`}),(0,Y.jsx)(`div`,{className:`intro__fade`,ref:c}),(0,Y.jsxs)(`button`,{className:`intro__skip`,onClick:()=>{l.current?.(),d(!0)},type:`button`,children:[`Sari peste `,(0,Y.jsx)(`span`,{"aria-hidden":`true`,children:`→`})]})]})}export{Le as default};