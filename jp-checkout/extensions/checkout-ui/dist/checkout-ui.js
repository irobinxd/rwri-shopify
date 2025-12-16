(()=>{var Pt=(e,t,n)=>new Promise((o,s)=>{var i=u=>{try{l(n.next(u))}catch(c){s(c)}},r=u=>{try{l(n.throw(u))}catch(c){s(c)}},l=u=>u.done?o(u.value):Promise.resolve(u.value).then(i,r);l((n=n.apply(e,t)).next())});var G,d,It,lt,R,St,Tt,Rt,Ot,ct,rt,st,ue,L={},Nt=[],_e=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,Y=Array.isArray;function C(e,t){for(var n in t)e[n]=t[n];return e}function ut(e){e&&e.parentNode&&e.parentNode.removeChild(e)}function pe(e,t,n){var o,s,i,r={};for(i in t)i=="key"?o=t[i]:i=="ref"?s=t[i]:r[i]=t[i];if(arguments.length>2&&(r.children=arguments.length>3?G.call(arguments,2):n),typeof e=="function"&&e.defaultProps!=null)for(i in e.defaultProps)r[i]===void 0&&(r[i]=e.defaultProps[i]);return z(e,r,o,s,null)}function z(e,t,n,o,s){var i={type:e,props:t,key:n,ref:o,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:s==null?++It:s,__i:-1,__u:0};return s==null&&d.vnode!=null&&d.vnode(i),i}function A(e){return e.children}function D(e,t){this.props=e,this.context=t}function F(e,t){if(t==null)return e.__?F(e.__,e.__i+1):null;for(var n;t<e.__k.length;t++)if((n=e.__k[t])!=null&&n.__e!=null)return n.__e;return typeof e.type=="function"?F(e):null}function Ut(e){var t,n;if((e=e.__)!=null&&e.__c!=null){for(e.__e=e.__c.base=null,t=0;t<e.__k.length;t++)if((n=e.__k[t])!=null&&n.__e!=null){e.__e=e.__c.base=n.__e;break}return Ut(e)}}function Ct(e){(!e.__d&&(e.__d=!0)&&R.push(e)&&!K.__r++||St!=d.debounceRendering)&&((St=d.debounceRendering)||Tt)(K)}function K(){for(var e,t,n,o,s,i,r,l=1;R.length;)R.length>l&&R.sort(Rt),e=R.shift(),l=R.length,e.__d&&(n=void 0,o=void 0,s=(o=(t=e).__v).__e,i=[],r=[],t.__P&&((n=C({},o)).__v=o.__v+1,d.vnode&&d.vnode(n),_t(t.__P,n,o,t.__n,t.__P.namespaceURI,32&o.__u?[s]:null,i,s==null?F(o):s,!!(32&o.__u),r),n.__v=o.__v,n.__.__k[n.__i]=n,Ht(i,n,r),o.__e=o.__=null,n.__e!=s&&Ut(n)));K.__r=0}function Dt(e,t,n,o,s,i,r,l,u,c,p){var a,f,_,b,E,x,v,m=o&&o.__k||Nt,w=t.length;for(u=fe(n,t,m,u,w),a=0;a<w;a++)(_=n.__k[a])!=null&&(f=_.__i==-1?L:m[_.__i]||L,_.__i=a,x=_t(e,_,f,s,i,r,l,u,c,p),b=_.__e,_.ref&&f.ref!=_.ref&&(f.ref&&pt(f.ref,null,_),p.push(_.ref,_.__c||b,_)),E==null&&b!=null&&(E=b),(v=!!(4&_.__u))||f.__k===_.__k?u=Ft(_,u,e,v):typeof _.type=="function"&&x!==void 0?u=x:b&&(u=b.nextSibling),_.__u&=-7);return n.__e=E,u}function fe(e,t,n,o,s){var i,r,l,u,c,p=n.length,a=p,f=0;for(e.__k=new Array(s),i=0;i<s;i++)(r=t[i])!=null&&typeof r!="boolean"&&typeof r!="function"?(typeof r=="string"||typeof r=="number"||typeof r=="bigint"||r.constructor==String?r=e.__k[i]=z(null,r,null,null,null):Y(r)?r=e.__k[i]=z(A,{children:r},null,null,null):r.constructor==null&&r.__b>0?r=e.__k[i]=z(r.type,r.props,r.key,r.ref?r.ref:null,r.__v):e.__k[i]=r,u=i+f,r.__=e,r.__b=e.__b+1,(c=r.__i=de(r,n,u,a))!=-1&&(a--,(l=n[c])&&(l.__u|=2)),l==null||l.__v==null?(c==-1&&(s>p?f--:s<p&&f++),typeof r.type!="function"&&(r.__u|=4)):c!=u&&(c==u-1?f--:c==u+1?f++:(c>u?f--:f++,r.__u|=4))):e.__k[i]=null;if(a)for(i=0;i<p;i++)(l=n[i])!=null&&(2&l.__u)==0&&(l.__e==o&&(o=F(l)),Mt(l,l));return o}function Ft(e,t,n,o){var s,i;if(typeof e.type=="function"){for(s=e.__k,i=0;s&&i<s.length;i++)s[i]&&(s[i].__=e,t=Ft(s[i],t,n,o));return t}e.__e!=t&&(o&&(t&&e.type&&!t.parentNode&&(t=F(e)),n.insertBefore(e.__e,t||null)),t=e.__e);do t=t&&t.nextSibling;while(t!=null&&t.nodeType==8);return t}function de(e,t,n,o){var s,i,r,l=e.key,u=e.type,c=t[n],p=c!=null&&(2&c.__u)==0;if(c===null&&l==null||p&&l==c.key&&u==c.type)return n;if(o>(p?1:0)){for(s=n-1,i=n+1;s>=0||i<t.length;)if((c=t[r=s>=0?s--:i++])!=null&&(2&c.__u)==0&&l==c.key&&u==c.type)return r}return-1}function wt(e,t,n){t[0]=="-"?e.setProperty(t,n==null?"":n):e[t]=n==null?"":typeof n!="number"||_e.test(t)?n:n+"px"}function V(e,t,n,o,s){var i,r;t:if(t=="style")if(typeof n=="string")e.style.cssText=n;else{if(typeof o=="string"&&(e.style.cssText=o=""),o)for(t in o)n&&t in n||wt(e.style,t,"");if(n)for(t in n)o&&n[t]==o[t]||wt(e.style,t,n[t])}else if(t[0]=="o"&&t[1]=="n")i=t!=(t=t.replace(Ot,"$1")),r=t.toLowerCase(),t=r in e||t=="onFocusOut"||t=="onFocusIn"?r.slice(2):t.slice(2),e.l||(e.l={}),e.l[t+i]=n,n?o?n.u=o.u:(n.u=ct,e.addEventListener(t,i?st:rt,i)):e.removeEventListener(t,i?st:rt,i);else{if(s=="http://www.w3.org/2000/svg")t=t.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(t!="width"&&t!="height"&&t!="href"&&t!="list"&&t!="form"&&t!="tabIndex"&&t!="download"&&t!="rowSpan"&&t!="colSpan"&&t!="role"&&t!="popover"&&t in e)try{e[t]=n==null?"":n;break t}catch(l){}typeof n=="function"||(n==null||n===!1&&t[4]!="-"?e.removeAttribute(t):e.setAttribute(t,t=="popover"&&n==1?"":n))}}function At(e){return function(t){if(this.l){var n=this.l[t.type+e];if(t.t==null)t.t=ct++;else if(t.t<n.u)return;return n(d.event?d.event(t):t)}}}function _t(e,t,n,o,s,i,r,l,u,c){var p,a,f,_,b,E,x,v,m,w,T,W,M,Et,q,B,it,P=t.type;if(t.constructor!=null)return null;128&n.__u&&(u=!!(32&n.__u),i=[l=t.__e=n.__e]),(p=d.__b)&&p(t);t:if(typeof P=="function")try{if(v=t.props,m="prototype"in P&&P.prototype.render,w=(p=P.contextType)&&o[p.__c],T=p?w?w.props.value:p.__:o,n.__c?x=(a=t.__c=n.__c).__=a.__E:(m?t.__c=a=new P(v,T):(t.__c=a=new D(v,T),a.constructor=P,a.render=me),w&&w.sub(a),a.state||(a.state={}),a.__n=o,f=a.__d=!0,a.__h=[],a._sb=[]),m&&a.__s==null&&(a.__s=a.state),m&&P.getDerivedStateFromProps!=null&&(a.__s==a.state&&(a.__s=C({},a.__s)),C(a.__s,P.getDerivedStateFromProps(v,a.__s))),_=a.props,b=a.state,a.__v=t,f)m&&P.getDerivedStateFromProps==null&&a.componentWillMount!=null&&a.componentWillMount(),m&&a.componentDidMount!=null&&a.__h.push(a.componentDidMount);else{if(m&&P.getDerivedStateFromProps==null&&v!==_&&a.componentWillReceiveProps!=null&&a.componentWillReceiveProps(v,T),t.__v==n.__v||!a.__e&&a.shouldComponentUpdate!=null&&a.shouldComponentUpdate(v,a.__s,T)===!1){for(t.__v!=n.__v&&(a.props=v,a.state=a.__s,a.__d=!1),t.__e=n.__e,t.__k=n.__k,t.__k.some(function(U){U&&(U.__=t)}),W=0;W<a._sb.length;W++)a.__h.push(a._sb[W]);a._sb=[],a.__h.length&&r.push(a);break t}a.componentWillUpdate!=null&&a.componentWillUpdate(v,a.__s,T),m&&a.componentDidUpdate!=null&&a.__h.push(function(){a.componentDidUpdate(_,b,E)})}if(a.context=T,a.props=v,a.__P=e,a.__e=!1,M=d.__r,Et=0,m){for(a.state=a.__s,a.__d=!1,M&&M(t),p=a.render(a.props,a.state,a.context),q=0;q<a._sb.length;q++)a.__h.push(a._sb[q]);a._sb=[]}else do a.__d=!1,M&&M(t),p=a.render(a.props,a.state,a.context),a.state=a.__s;while(a.__d&&++Et<25);a.state=a.__s,a.getChildContext!=null&&(o=C(C({},o),a.getChildContext())),m&&!f&&a.getSnapshotBeforeUpdate!=null&&(E=a.getSnapshotBeforeUpdate(_,b)),B=p,p!=null&&p.type===A&&p.key==null&&(B=jt(p.props.children)),l=Dt(e,Y(B)?B:[B],t,n,o,s,i,r,l,u,c),a.base=t.__e,t.__u&=-161,a.__h.length&&r.push(a),x&&(a.__E=a.__=null)}catch(U){if(t.__v=null,u||i!=null)if(U.then){for(t.__u|=u?160:128;l&&l.nodeType==8&&l.nextSibling;)l=l.nextSibling;i[i.indexOf(l)]=null,t.__e=l}else{for(it=i.length;it--;)ut(i[it]);at(t)}else t.__e=n.__e,t.__k=n.__k,U.then||at(t);d.__e(U,t,n)}else i==null&&t.__v==n.__v?(t.__k=n.__k,t.__e=n.__e):l=t.__e=he(n.__e,t,n,o,s,i,r,u,c);return(p=d.diffed)&&p(t),128&t.__u?void 0:l}function at(e){e&&e.__c&&(e.__c.__e=!0),e&&e.__k&&e.__k.forEach(at)}function Ht(e,t,n){for(var o=0;o<n.length;o++)pt(n[o],n[++o],n[++o]);d.__c&&d.__c(t,e),e.some(function(s){try{e=s.__h,s.__h=[],e.some(function(i){i.call(s)})}catch(i){d.__e(i,s.__v)}})}function jt(e){return typeof e!="object"||e==null||e.__b&&e.__b>0?e:Y(e)?e.map(jt):C({},e)}function he(e,t,n,o,s,i,r,l,u){var c,p,a,f,_,b,E,x=n.props||L,v=t.props,m=t.type;if(m=="svg"?s="http://www.w3.org/2000/svg":m=="math"?s="http://www.w3.org/1998/Math/MathML":s||(s="http://www.w3.org/1999/xhtml"),i!=null){for(c=0;c<i.length;c++)if((_=i[c])&&"setAttribute"in _==!!m&&(m?_.localName==m:_.nodeType==3)){e=_,i[c]=null;break}}if(e==null){if(m==null)return document.createTextNode(v);e=document.createElementNS(s,m,v.is&&v),l&&(d.__m&&d.__m(t,i),l=!1),i=null}if(m==null)x===v||l&&e.data==v||(e.data=v);else{if(i=i&&G.call(e.childNodes),!l&&i!=null)for(x={},c=0;c<e.attributes.length;c++)x[(_=e.attributes[c]).name]=_.value;for(c in x)if(_=x[c],c!="children"){if(c=="dangerouslySetInnerHTML")a=_;else if(!(c in v)){if(c=="value"&&"defaultValue"in v||c=="checked"&&"defaultChecked"in v)continue;V(e,c,null,_,s)}}for(c in v)_=v[c],c=="children"?f=_:c=="dangerouslySetInnerHTML"?p=_:c=="value"?b=_:c=="checked"?E=_:l&&typeof _!="function"||x[c]===_||V(e,c,_,x[c],s);if(p)l||a&&(p.__html==a.__html||p.__html==e.innerHTML)||(e.innerHTML=p.__html),t.__k=[];else if(a&&(e.innerHTML=""),Dt(t.type=="template"?e.content:e,Y(f)?f:[f],t,n,o,m=="foreignObject"?"http://www.w3.org/1999/xhtml":s,i,r,i?i[0]:n.__k&&F(n,0),l,u),i!=null)for(c=i.length;c--;)ut(i[c]);l||(c="value",m=="progress"&&b==null?e.removeAttribute("value"):b!=null&&(b!==e[c]||m=="progress"&&!b||m=="option"&&b!=x[c])&&V(e,c,b,x[c],s),c="checked",E!=null&&E!=e[c]&&V(e,c,E,x[c],s))}return e}function pt(e,t,n){try{if(typeof e=="function"){var o=typeof e.__u=="function";o&&e.__u(),o&&t==null||(e.__u=e(t))}else e.current=t}catch(s){d.__e(s,n)}}function Mt(e,t,n){var o,s;if(d.unmount&&d.unmount(e),(o=e.ref)&&(o.current&&o.current!=e.__e||pt(o,null,t)),(o=e.__c)!=null){if(o.componentWillUnmount)try{o.componentWillUnmount()}catch(i){d.__e(i,t)}o.base=o.__P=null}if(o=e.__k)for(s=0;s<o.length;s++)o[s]&&Mt(o[s],t,n||typeof e.type!="function");n||ut(e.__e),e.__c=e.__=e.__e=void 0}function me(e,t,n){return this.constructor(e,n)}function Bt(e,t,n){var o,s,i,r;t==document&&(t=document.documentElement),d.__&&d.__(e,t),s=(o=typeof n=="function")?null:n&&n.__k||t.__k,i=[],r=[],_t(t,e=(!o&&n||t).__k=pe(A,null,[e]),s||L,L,t.namespaceURI,!o&&n?[n]:s?null:t.firstChild?G.call(t.childNodes):null,i,!o&&n?n:s?s.__e:t.firstChild,o,r),Ht(i,e,r)}G=Nt.slice,d={__e:function(e,t,n,o){for(var s,i,r;t=t.__;)if((s=t.__c)&&!s.__)try{if((i=s.constructor)&&i.getDerivedStateFromError!=null&&(s.setState(i.getDerivedStateFromError(e)),r=s.__d),s.componentDidCatch!=null&&(s.componentDidCatch(e,o||{}),r=s.__d),r)return s.__E=s}catch(l){e=l}throw e}},It=0,lt=function(e){return e!=null&&e.constructor==null},D.prototype.setState=function(e,t){var n;n=this.__s!=null&&this.__s!=this.state?this.__s:this.__s=C({},this.state),typeof e=="function"&&(e=e(C({},n),this.props)),e&&C(n,e),e!=null&&this.__v&&(t&&this._sb.push(t),Ct(this))},D.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),Ct(this))},D.prototype.render=A,R=[],Tt=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,Rt=function(e,t){return e.__v.__b-t.__v.__b},K.__r=0,Ot=/(PointerCapture)$|Capture$/i,ct=0,rt=At(!1),st=At(!0),ue=0;var J,g,ft,Lt,dt=0,Yt=[],k=d,$t=k.__b,Wt=k.__r,qt=k.diffed,Vt=k.__c,zt=k.unmount,Kt=k.__;function Zt(e,t){k.__h&&k.__h(g,e,dt||t),dt=0;var n=g.__H||(g.__H={__:[],__h:[]});return e>=n.__.length&&n.__.push({}),n.__[e]}function Jt(e){return dt=1,ve(Qt,e)}function ve(e,t,n){var o=Zt(J++,2);if(o.t=e,!o.__c&&(o.__=[n?n(t):Qt(void 0,t),function(l){var u=o.__N?o.__N[0]:o.__[0],c=o.t(u,l);u!==c&&(o.__N=[c,o.__[1]],o.__c.setState({}))}],o.__c=g,!g.__f)){var s=function(l,u,c){if(!o.__c.__H)return!0;var p=o.__c.__H.__.filter(function(f){return!!f.__c});if(p.every(function(f){return!f.__N}))return!i||i.call(this,l,u,c);var a=o.__c.props!==l;return p.forEach(function(f){if(f.__N){var _=f.__[0];f.__=f.__N,f.__N=void 0,_!==f.__[0]&&(a=!0)}}),i&&i.call(this,l,u,c)||a};g.__f=!0;var i=g.shouldComponentUpdate,r=g.componentWillUpdate;g.componentWillUpdate=function(l,u,c){if(this.__e){var p=i;i=void 0,s(l,u,c),i=p}r&&r.call(this,l,u,c)},g.shouldComponentUpdate=s}return o.__N||o.__}function Xt(e,t){var n=Zt(J++,7);return ke(n.__H,t)&&(n.__=e(),n.__H=t,n.__h=e),n.__}function ye(){for(var e;e=Yt.shift();)if(e.__P&&e.__H)try{e.__H.__h.forEach(Z),e.__H.__h.forEach(ht),e.__H.__h=[]}catch(t){e.__H.__h=[],k.__e(t,e.__v)}}k.__b=function(e){g=null,$t&&$t(e)},k.__=function(e,t){e&&t.__k&&t.__k.__m&&(e.__m=t.__k.__m),Kt&&Kt(e,t)},k.__r=function(e){Wt&&Wt(e),J=0;var t=(g=e.__c).__H;t&&(ft===g?(t.__h=[],g.__h=[],t.__.forEach(function(n){n.__N&&(n.__=n.__N),n.u=n.__N=void 0})):(t.__h.forEach(Z),t.__h.forEach(ht),t.__h=[],J=0)),ft=g},k.diffed=function(e){qt&&qt(e);var t=e.__c;t&&t.__H&&(t.__H.__h.length&&(Yt.push(t)!==1&&Lt===k.requestAnimationFrame||((Lt=k.requestAnimationFrame)||ge)(ye)),t.__H.__.forEach(function(n){n.u&&(n.__H=n.u),n.u=void 0})),ft=g=null},k.__c=function(e,t){t.some(function(n){try{n.__h.forEach(Z),n.__h=n.__h.filter(function(o){return!o.__||ht(o)})}catch(o){t.some(function(s){s.__h&&(s.__h=[])}),t=[],k.__e(o,n.__v)}}),Vt&&Vt(e,t)},k.unmount=function(e){zt&&zt(e);var t,n=e.__c;n&&n.__H&&(n.__H.__.forEach(function(o){try{Z(o)}catch(s){t=s}}),n.__H=void 0,t&&k.__e(t,n.__v))};var Gt=typeof requestAnimationFrame=="function";function ge(e){var t,n=function(){clearTimeout(o),Gt&&cancelAnimationFrame(t),setTimeout(e)},o=setTimeout(n,35);Gt&&(t=requestAnimationFrame(n))}function Z(e){var t=g,n=e.__c;typeof n=="function"&&(e.__c=void 0,n()),g=t}function ht(e){var t=g;e.__c=e.__(),g=t}function ke(e,t){return!e||e.length!==t.length||t.some(function(n,o){return n!==e[o]})}function Qt(e,t){return typeof t=="function"?t(e):t}var be=Symbol.for("preact-signals");function Q(){if(I>1)I--;else{for(var e,t=!1;$!==void 0;){var n=$;for($=void 0,mt++;n!==void 0;){var o=n.o;if(n.o=void 0,n.f&=-3,!(8&n.f)&&ee(n))try{n.c()}catch(s){t||(e=s,t=!0)}n=o}}if(mt=0,I--,t)throw e}}function vt(e){if(I>0)return e();I++;try{return e()}finally{Q()}}var h=void 0;function yt(e){var t=h;h=void 0;try{return e()}finally{h=t}}var $=void 0,I=0,mt=0,X=0;function te(e){if(h!==void 0){var t=e.n;if(t===void 0||t.t!==h)return t={i:0,S:e,p:h.s,n:void 0,t:h,e:void 0,x:void 0,r:t},h.s!==void 0&&(h.s.n=t),h.s=t,e.n=t,32&h.f&&e.S(t),t;if(t.i===-1)return t.i=0,t.n!==void 0&&(t.n.p=t.p,t.p!==void 0&&(t.p.n=t.n),t.p=h.s,t.n=void 0,h.s.n=t,h.s=t),t}}function y(e,t){this.v=e,this.i=0,this.n=void 0,this.t=void 0,this.W=t==null?void 0:t.watched,this.Z=t==null?void 0:t.unwatched,this.name=t==null?void 0:t.name}y.prototype.brand=be;y.prototype.h=function(){return!0};y.prototype.S=function(e){var t=this,n=this.t;n!==e&&e.e===void 0&&(e.x=n,this.t=e,n!==void 0?n.e=e:yt(function(){var o;(o=t.W)==null||o.call(t)}))};y.prototype.U=function(e){var t=this;if(this.t!==void 0){var n=e.e,o=e.x;n!==void 0&&(n.x=o,e.e=void 0),o!==void 0&&(o.e=n,e.x=void 0),e===this.t&&(this.t=o,o===void 0&&yt(function(){var s;(s=t.Z)==null||s.call(t)}))}};y.prototype.subscribe=function(e){var t=this;return N(function(){var n=t.value,o=h;h=void 0;try{e(n)}finally{h=o}},{name:"sub"})};y.prototype.valueOf=function(){return this.value};y.prototype.toString=function(){return this.value+""};y.prototype.toJSON=function(){return this.value};y.prototype.peek=function(){var e=h;h=void 0;try{return this.value}finally{h=e}};Object.defineProperty(y.prototype,"value",{get:function(){var e=te(this);return e!==void 0&&(e.i=this.i),this.v},set:function(e){if(e!==this.v){if(mt>100)throw new Error("Cycle detected");this.v=e,this.i++,X++,I++;try{for(var t=this.t;t!==void 0;t=t.x)t.t.N()}finally{Q()}}}});function tt(e,t){return new y(e,t)}function ee(e){for(var t=e.s;t!==void 0;t=t.n)if(t.S.i!==t.i||!t.S.h()||t.S.i!==t.i)return!0;return!1}function ne(e){for(var t=e.s;t!==void 0;t=t.n){var n=t.S.n;if(n!==void 0&&(t.r=n),t.S.n=t,t.i=-1,t.n===void 0){e.s=t;break}}}function oe(e){for(var t=e.s,n=void 0;t!==void 0;){var o=t.p;t.i===-1?(t.S.U(t),o!==void 0&&(o.n=t.n),t.n!==void 0&&(t.n.p=o)):n=t,t.S.n=t.r,t.r!==void 0&&(t.r=void 0),t=o}e.s=n}function O(e,t){y.call(this,void 0),this.x=e,this.s=void 0,this.g=X-1,this.f=4,this.W=t==null?void 0:t.watched,this.Z=t==null?void 0:t.unwatched,this.name=t==null?void 0:t.name}O.prototype=new y;O.prototype.h=function(){if(this.f&=-3,1&this.f)return!1;if((36&this.f)==32||(this.f&=-5,this.g===X))return!0;if(this.g=X,this.f|=1,this.i>0&&!ee(this))return this.f&=-2,!0;var e=h;try{ne(this),h=this;var t=this.x();(16&this.f||this.v!==t||this.i===0)&&(this.v=t,this.f&=-17,this.i++)}catch(n){this.v=n,this.f|=16,this.i++}return h=e,oe(this),this.f&=-2,!0};O.prototype.S=function(e){if(this.t===void 0){this.f|=36;for(var t=this.s;t!==void 0;t=t.n)t.S.S(t)}y.prototype.S.call(this,e)};O.prototype.U=function(e){if(this.t!==void 0&&(y.prototype.U.call(this,e),this.t===void 0)){this.f&=-33;for(var t=this.s;t!==void 0;t=t.n)t.S.U(t)}};O.prototype.N=function(){if(!(2&this.f)){this.f|=6;for(var e=this.t;e!==void 0;e=e.x)e.t.N()}};Object.defineProperty(O.prototype,"value",{get:function(){if(1&this.f)throw new Error("Cycle detected");var e=te(this);if(this.h(),e!==void 0&&(e.i=this.i),16&this.f)throw this.v;return this.v}});function et(e,t){return new O(e,t)}function ie(e){var t=e.u;if(e.u=void 0,typeof t=="function"){I++;var n=h;h=void 0;try{t()}catch(o){throw e.f&=-2,e.f|=8,gt(e),o}finally{h=n,Q()}}}function gt(e){for(var t=e.s;t!==void 0;t=t.n)t.S.U(t);e.x=void 0,e.s=void 0,ie(e)}function xe(e){if(h!==this)throw new Error("Out-of-order effect");oe(this),h=e,this.f&=-2,8&this.f&&gt(this),Q()}function H(e,t){this.x=e,this.u=void 0,this.s=void 0,this.o=void 0,this.f=32,this.name=t==null?void 0:t.name}H.prototype.c=function(){var e=this.S();try{if(8&this.f||this.x===void 0)return;var t=this.x();typeof t=="function"&&(this.u=t)}finally{e()}};H.prototype.S=function(){if(1&this.f)throw new Error("Cycle detected");this.f|=1,this.f&=-9,ie(this),ne(this),I++;var e=h;return h=this,xe.bind(this,e)};H.prototype.N=function(){2&this.f||(this.f|=2,this.o=$,$=this)};H.prototype.d=function(){this.f|=8,1&this.f||gt(this)};H.prototype.dispose=function(){this.d()};function N(e,t){var n=new H(e,t);try{n.c()}catch(s){throw n.d(),s}var o=n.d.bind(n);return o[Symbol.dispose]=o,o}var re,bt,kt,ot=typeof window!="undefined"&&!!window.__PREACT_SIGNALS_DEVTOOLS__;var se=[];N(function(){re=this.N})();function j(e,t){d[e]=t.bind(null,d[e]||function(){})}function nt(e){kt&&kt(),kt=e&&e.S()}function ae(e){var t=this,n=e.data,o=Pe(n);o.value=n;var s=Xt(function(){for(var l=t,u=t.__v;u=u.__;)if(u.__c){u.__c.__$f|=4;break}var c=et(function(){var _=o.value.value;return _===0?0:_===!0?"":_||""}),p=et(function(){return!Array.isArray(c.value)&&!lt(c.value)}),a=N(function(){if(this.N=le,p.value){var _=c.value;l.__v&&l.__v.__e&&l.__v.__e.nodeType===3&&(l.__v.__e.data=_)}}),f=t.__$u.d;return t.__$u.d=function(){a(),f.call(this)},[p,c]},[]),i=s[0],r=s[1];return i.value?r.peek():r.value}ae.displayName="ReactiveTextNode";Object.defineProperties(y.prototype,{constructor:{configurable:!0,value:void 0},type:{configurable:!0,value:ae},props:{configurable:!0,get:function(){return{data:this}}},__b:{configurable:!0,value:1}});j("__b",function(e,t){if(ot&&typeof t.type=="function"&&window.__PREACT_SIGNALS_DEVTOOLS__.exitComponent(),typeof t.type=="string"){var n,o=t.props;for(var s in o)if(s!=="children"){var i=o[s];i instanceof y&&(n||(t.__np=n={}),n[s]=i,o[s]=i.peek())}}e(t)});j("__r",function(e,t){if(ot&&typeof t.type=="function"&&window.__PREACT_SIGNALS_DEVTOOLS__.enterComponent(t),t.type!==A){nt();var n,o=t.__c;o&&(o.__$f&=-2,(n=o.__$u)===void 0&&(o.__$u=n=(function(s){var i;return N(function(){i=this}),i.c=function(){o.__$f|=1,o.setState({})},i})())),bt=o,nt(n)}e(t)});j("__e",function(e,t,n,o){ot&&window.__PREACT_SIGNALS_DEVTOOLS__.exitComponent(),nt(),bt=void 0,e(t,n,o)});j("diffed",function(e,t){ot&&typeof t.type=="function"&&window.__PREACT_SIGNALS_DEVTOOLS__.exitComponent(),nt(),bt=void 0;var n;if(typeof t.type=="string"&&(n=t.__e)){var o=t.__np,s=t.props;if(o){var i=n.U;if(i)for(var r in i){var l=i[r];l!==void 0&&!(r in o)&&(l.d(),i[r]=void 0)}else i={},n.U=i;for(var u in o){var c=i[u],p=o[u];c===void 0?(c=Ee(n,u,p,s),i[u]=c):c.o(p,s)}}}e(t)});function Ee(e,t,n,o){var s=t in e&&e.ownerSVGElement===void 0,i=tt(n);return{o:function(r,l){i.value=r,o=l},d:N(function(){this.N=le;var r=i.value.value;o[t]!==r&&(o[t]=r,s?e[t]=r:r!=null&&(r!==!1||t[4]==="-")?e.setAttribute(t,r):e.removeAttribute(t))})}}j("unmount",function(e,t){if(typeof t.type=="string"){var n=t.__e;if(n){var o=n.U;if(o){n.U=void 0;for(var s in o){var i=o[s];i&&i.d()}}}}else{var r=t.__c;if(r){var l=r.__$u;l&&(r.__$u=void 0,l.d())}}e(t)});j("__h",function(e,t,n,o){(o<3||o===9)&&(t.__$f|=2),e(t,n,o)});D.prototype.shouldComponentUpdate=function(e,t){var n=this.__$u,o=n&&n.s!==void 0;for(var s in t)return!0;if(this.__f||typeof this.u=="boolean"&&this.u===!0){var i=2&this.__$f;if(!(o||i||4&this.__$f)||1&this.__$f)return!0}else if(!(o||4&this.__$f)||3&this.__$f)return!0;for(var r in e)if(r!=="__source"&&e[r]!==this.props[r])return!0;for(var l in this.props)if(!(l in e))return!0;return!1};function Pe(e,t){return Jt(function(){return tt(e,t)})[0]}var Se=function(e){queueMicrotask(function(){queueMicrotask(e)})};function Ce(){vt(function(){for(var e;e=se.shift();)re.call(e)})}function le(){se.push(this)===1&&(d.requestAnimationFrame||Se)(Ce)}var xt=globalThis.shopify;xt&&typeof xt.setSignals=="function"&&xt.setSignals(y);var we=0;function S(e,t,n,o,s,i){t||(t={});var r,l,u=t;if("ref"in u)for(l in u={},t)l=="ref"?r=t[l]:u[l]=t[l];var c={type:e,props:u,key:n,ref:r,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--we,__i:-1,__u:0,__source:s,__self:i};if(typeof e=="function"&&(r=e.defaultProps))for(l in r)u[l]===void 0&&(u[l]=r[l]);return d.vnode&&d.vnode(c),c}var ce=()=>Pt(null,null,function*(){Bt(S(Ae,{}),document.body)});function Ae(){var s,i;let e=shopify.cart.attributes||[];console.log("Checkout Extension - Cart attributes:",e),console.log("Checkout Extension - Full cart:",shopify.cart);let t=((s=e.find(r=>r.key==="Platter Pickup Date"))==null?void 0:s.value)||"",n=((i=e.find(r=>r.key==="Other Items Pickup Date"))==null?void 0:i.value)||"";console.log("Checkout Extension - Platter Pickup Date:",t),console.log("Checkout Extension - Other Items Pickup Date:",n);let o=typeof window!="undefined"?window:typeof globalThis!="undefined"?globalThis:{};if(!o.__checkoutAttributesSet){o.__checkoutAttributesSet=!0;let r=[];t&&r.push(shopify.applyAttributeChange({key:"Platter Pickup Date",type:"updateAttribute",value:t}).catch(l=>console.log("Error setting Platter Pickup Date:",l))),n&&r.push(shopify.applyAttributeChange({key:"Other Items Pickup Date",type:"updateAttribute",value:n}).catch(l=>console.log("Error setting Other Items Pickup Date:",l))),t||r.push(shopify.applyAttributeChange({key:"Platter Pickup Date",type:"updateAttribute",value:""}).catch(()=>{})),n||r.push(shopify.applyAttributeChange({key:"Other Items Pickup Date",type:"updateAttribute",value:""}).catch(()=>{})),Promise.all(r).catch(()=>{})}return o.__checkoutCustomizationInjected?console.log("\u26A0\uFE0F Checkout Extension: Customization already injected (skipping)"):(o.__checkoutCustomizationInjected=!0,console.log("\u{1F680} Checkout Extension: Starting customization injection..."),typeof setTimeout!="undefined"?setTimeout(()=>{try{if(console.log("\u{1F680} Checkout Extension: Attempting to inject CSS and script..."),typeof document!="undefined"){if(document.getElementById("checkout-custom-css"))console.log("\u26A0\uFE0F Checkout Extension: CSS already injected");else{let r=document.createElement("style");r.id="checkout-custom-css",r.textContent=`
                /* Custom colors for checkout elements */
                :root {
                  --custom-primary-color: #0066cc;
                  --custom-success-color: #00a651;
                  --custom-warning-color: #ff9900;
                  --custom-error-color: #d72c0d;
                }
                
                /* Style the extension banner */
                s-banner[heading="Pickup Information"] {
                  background-color: #f0f8ff !important;
                  border-left: 4px solid var(--custom-primary-color) !important;
                }
                
                /* Hide "PICK UP/BOOK YOUR OWN RIDER" text - more aggressive targeting */
                #local_pickup_methods strong,
                #local_pickup_methods [class*="_1u2aa6me"] strong,
                #local_pickup_methods [class*="_1u2aa6mj"] strong,
                [id="local_pickup_methods"] strong,
                [id="local_pickup_methods"] [class*="_1u2aa6me"] strong,
                [id="local_pickup_methods"] [class*="_1u2aa6mj"] strong,
                #local_pickup_methods strong span,
                #local_pickup_methods [class*="_1u2aa6me"] strong span,
                #local_pickup_methods [class*="_1u2aa6mj"] strong span {
                  display: none !important;
                  visibility: hidden !important;
                  opacity: 0 !important;
                  height: 0 !important;
                  width: 0 !important;
                  overflow: hidden !important;
                  font-size: 0 !important;
                  line-height: 0 !important;
                  padding: 0 !important;
                  margin: 0 !important;
                  position: absolute !important;
                  left: -9999px !important;
                }
                
                /* Hide "FREE" and "Usually ready in X hours" text on the right side - more aggressive */
                #local_pickup_methods [class*="_1u2aa6me"],
                #local_pickup_methods [class*="_1u2aa6mj"],
                [id="local_pickup_methods"] [class*="_1u2aa6me"],
                [id="local_pickup_methods"] [class*="_1u2aa6mj"],
                #local_pickup_methods [class*="_16s97g73r"],
                [id="local_pickup_methods"] [class*="_16s97g73r"],
                #local_pickup_methods [class*="_1u2aa6me"] p,
                #local_pickup_methods [class*="_1u2aa6mj"] p,
                [id="local_pickup_methods"] [class*="_1u2aa6me"] p,
                [id="local_pickup_methods"] [class*="_1u2aa6mj"] p,
                #local_pickup_methods [class*="_16s97g73r"] p,
                [id="local_pickup_methods"] [class*="_16s97g73r"] p,
                #local_pickup_methods [class*="_1u2aa6me"] [class*="_16s97g73r"],
                #local_pickup_methods [class*="_1u2aa6mj"] [class*="_16s97g73r"],
                [id="local_pickup_methods"] [class*="_1u2aa6me"] [class*="_16s97g73r"],
                [id="local_pickup_methods"] [class*="_1u2aa6mj"] [class*="_16s97g73r"] {
                  display: none !important;
                  visibility: hidden !important;
                  opacity: 0 !important;
                  height: 0 !important;
                  width: 0 !important;
                  overflow: hidden !important;
                  font-size: 0 !important;
                  line-height: 0 !important;
                  padding: 0 !important;
                  margin: 0 !important;
                  position: absolute !important;
                  left: -9999px !important;
                }
              `;let l=document.head||document.getElementsByTagName("head")[0]||document.body;l?(l.appendChild(r),console.log("\u2705 Checkout Extension: Custom CSS injected successfully")):console.error("\u274C Checkout Extension: Could not find target for CSS injection")}if(document.getElementById("checkout-custom-script-injected"))console.log("\u26A0\uFE0F Checkout Extension: Script already injected");else{console.log("\u{1F680} Checkout Extension: Injecting script inline...");let r=document.createElement("script");r.id="checkout-custom-script-injected",r.textContent=`
                (function() {
                  'use strict';
                  console.log('\u2705 Checkout customization script executing...');
                  
                  // Hide "PICK UP/BOOK YOUR OWN RIDER" text - more aggressive search
                  function hidePickupBookRiderText() {
                    console.log('\u{1F50D} hidePickupBookRiderText: Starting search...');
                    
                    // Try multiple ways to find the container
                    let localPickupMethods = document.getElementById('local_pickup_methods');
                    
                    // If not found by ID, try other methods
                    if (!localPickupMethods) {
                      console.log('\u{1F50D} Trying alternative selectors...');
                      const alternatives = [
                        '[id*="local_pickup"]',
                        '[id*="pickup"]',
                        '[class*="local_pickup"]',
                        '[class*="pickup_methods"]',
                        '[data-testid*="pickup"]',
                        'section[aria-label*="pickup" i]',
                        'section[aria-label*="delivery" i]'
                      ];
                      
                      for (const selector of alternatives) {
                        localPickupMethods = document.querySelector(selector);
                        if (localPickupMethods) {
                          console.log('\u2705 Found container with selector:', selector);
                          break;
                        }
                      }
                    }
                    
                    console.log('local_pickup_methods found:', !!localPickupMethods);
                    
                    // Search entire document if container not found
                    const searchScope = localPickupMethods || document.body;
                    
                    // Search for the text anywhere in the scope
                    const allElements = searchScope.querySelectorAll('*');
                    let foundCount = 0;
                    
                    console.log('\u{1F50D} Searching', allElements.length, 'elements...');
                    
                    allElements.forEach(el => {
                      const text = (el.textContent || '').trim();
                      const hasPickupText = text.includes('PICK UP/BOOK YOUR OWN RIDER') || 
                                           (text.includes('PICK UP') && text.includes('BOOK YOUR OWN RIDER'));
                      
                      if (hasPickupText && !el.hasAttribute('data-hidden')) {
                        console.log('\u{1F6AB} Found and hiding element:', text.substring(0, 80));
                        el.style.setProperty('display', 'none', 'important');
                        el.style.setProperty('visibility', 'hidden', 'important');
                        el.style.setProperty('opacity', '0', 'important');
                        el.style.setProperty('position', 'absolute', 'important');
                        el.style.setProperty('left', '-9999px', 'important');
                        el.style.setProperty('height', '0', 'important');
                        el.style.setProperty('width', '0', 'important');
                        el.style.setProperty('overflow', 'hidden', 'important');
                        el.style.setProperty('font-size', '0', 'important');
                        el.style.setProperty('line-height', '0', 'important');
                        el.style.setProperty('padding', '0', 'important');
                        el.style.setProperty('margin', '0', 'important');
                        el.setAttribute('data-hidden', 'true');
                        foundCount++;
                      }
                    });
                    
                    console.log('\u2705 Hidden', foundCount, 'elements with "PICK UP/BOOK YOUR OWN RIDER"');
                  }
                  
                  // Hide "FREE" and "Usually ready in X hours" text
                  function hideRightSideText() {
                    console.log('\u{1F50D} hideRightSideText: Starting search...');
                    
                    // Try multiple ways to find the container
                    let localPickupMethods = document.getElementById('local_pickup_methods');
                    
                    if (!localPickupMethods) {
                      const alternatives = [
                        '[id*="local_pickup"]',
                        '[id*="pickup"]',
                        '[class*="local_pickup"]',
                        '[class*="pickup_methods"]'
                      ];
                      
                      for (const selector of alternatives) {
                        localPickupMethods = document.querySelector(selector);
                        if (localPickupMethods) break;
                      }
                    }
                    
                    const searchScope = localPickupMethods || document.body;
                    console.log('Search scope:', searchScope?.id || searchScope?.tagName);
                    
                    if (localPickupMethods) {
                      // Try to find right side containers
                      const rightSideContainers = localPickupMethods.querySelectorAll('[class*="_1u2aa6me"], [class*="_1u2aa6mj"]');
                      console.log('Right side containers found:', rightSideContainers.length);
                      
                      if (rightSideContainers.length === 0) {
                        // Fallback: search all elements in container
                        const allElements = localPickupMethods.querySelectorAll('*');
                        console.log('Searching all', allElements.length, 'elements in local_pickup_methods');
                        
                        allElements.forEach(el => {
                          const text = (el.textContent || '').trim();
                          const isFree = text === 'FREE' || (text.includes('FREE') && text.length < 10 && !text.includes('FREESHIPPING'));
                          const isReady = text.includes('Usually ready') || text.includes('ready in') || /ready in \\d+/i.test(text);
                          
                          if ((isFree || isReady) && !el.hasAttribute('data-hidden')) {
                            console.log('\u{1F6AB} Hiding element:', text.substring(0, 50));
                            el.style.setProperty('display', 'none', 'important');
                            el.style.setProperty('visibility', 'hidden', 'important');
                            el.style.setProperty('opacity', '0', 'important');
                            el.style.setProperty('height', '0', 'important');
                            el.style.setProperty('width', '0', 'important');
                            el.style.setProperty('overflow', 'hidden', 'important');
                            el.style.setProperty('font-size', '0', 'important');
                            el.setAttribute('data-hidden', 'true');
                          }
                        });
                      } else {
                        rightSideContainers.forEach(container => {
                          const allElements = container.querySelectorAll('*');
                          allElements.forEach(el => {
                            const text = (el.textContent || '').trim();
                            if (text === 'FREE' || (text.includes('FREE') && text.length < 10)) {
                              console.log('\u{1F6AB} Hiding FREE text');
                              el.style.setProperty('display', 'none', 'important');
                              el.style.setProperty('visibility', 'hidden', 'important');
                              el.style.setProperty('opacity', '0', 'important');
                              el.setAttribute('data-hidden', 'true');
                            }
                            if (text.includes('Usually ready') || text.includes('ready in') || /ready in \\d+/i.test(text)) {
                              console.log('\u{1F6AB} Hiding ready time text:', text);
                              el.style.setProperty('display', 'none', 'important');
                              el.style.setProperty('visibility', 'hidden', 'important');
                              el.style.setProperty('opacity', '0', 'important');
                              el.setAttribute('data-hidden', 'true');
                            }
                          });
                        });
                      }
                    } else {
                      // Search entire document if container not found
                      console.warn('\u26A0\uFE0F local_pickup_methods not found, searching entire document...');
                      const allElements = document.querySelectorAll('*');
                      let hiddenCount = 0;
                      
                      allElements.forEach(el => {
                        const text = (el.textContent || '').trim();
                        const isFree = text === 'FREE' || (text.includes('FREE') && text.length < 10 && !text.includes('FREESHIPPING'));
                        const isReady = text.includes('Usually ready') || text.includes('ready in') || /ready in \\d+/i.test(text);
                        
                        if ((isFree || isReady) && !el.hasAttribute('data-hidden')) {
                          // Make sure it's in a pickup/delivery context
                          const parent = el.closest('[id*="pickup"], [id*="delivery"], [class*="pickup"], [class*="delivery"]');
                          if (parent) {
                            console.log('\u{1F6AB} Hiding element (document-wide search):', text.substring(0, 50));
                            el.style.setProperty('display', 'none', 'important');
                            el.style.setProperty('visibility', 'hidden', 'important');
                            el.style.setProperty('opacity', '0', 'important');
                            el.setAttribute('data-hidden', 'true');
                            hiddenCount++;
                          }
                        }
                      });
                      
                      console.log('\u2705 Hidden', hiddenCount, 'elements (document-wide search)');
                    }
                  }
                  
                  // Add hidden inputs for pickup dates
                  function addHiddenInputs() {
                    let platterValue = '';
                    let otherValue = '';
                    
                    try {
                      if (window.Shopify?.checkout?.cart?.attributes) {
                        const attrs = window.Shopify.checkout.cart.attributes;
                        const platterAttr = attrs.find(attr => attr.key === 'Platter Pickup Date');
                        const otherAttr = attrs.find(attr => attr.key === 'Other Items Pickup Date');
                        if (platterAttr) platterValue = platterAttr.value || '';
                        if (otherAttr) otherValue = otherAttr.value || '';
                        console.log('\u{1F4E6} Cart attributes - Platter:', platterValue, 'Other:', otherValue);
                      }
                    } catch(e) {
                      console.log('Error reading cart attributes:', e);
                    }
                    
                    const targetSection = document.getElementById('local_pickup_methods') || 
                                         document.querySelector('[class*="delivery"], [id*="delivery"]') ||
                                         document.body;
                    
                    console.log('Target section for inputs:', targetSection?.id || targetSection?.tagName);
                    
                    if (targetSection && !document.getElementById('platter-datetime-attr')) {
                      const platterInput = document.createElement('input');
                      platterInput.type = 'hidden';
                      platterInput.name = 'attributes[Platter Pickup Date]';
                      platterInput.id = 'platter-datetime-attr';
                      platterInput.value = platterValue;
                      targetSection.insertBefore(platterInput, targetSection.firstChild);
                      console.log('\u2705 Added platter pickup date input');
                    }
                    
                    if (targetSection && !document.getElementById('non-platter-datetime-attr')) {
                      const otherInput = document.createElement('input');
                      otherInput.type = 'hidden';
                      otherInput.name = 'attributes[Other Items Pickup Date]';
                      otherInput.id = 'non-platter-datetime-attr';
                      otherInput.value = otherValue;
                      const platterInput = document.getElementById('platter-datetime-attr');
                      if (platterInput) {
                        targetSection.insertBefore(otherInput, platterInput.nextSibling);
                      } else {
                        targetSection.insertBefore(otherInput, targetSection.firstChild);
                      }
                      console.log('\u2705 Added other items pickup date input');
                    }
                  }
                  
                  // Run functions
                  function runChanges() {
                    console.log('\u{1F504} Running checkout customizations...');
                    hidePickupBookRiderText();
                    hideRightSideText();
                    addHiddenInputs();
                  }
                  
                  // Execute immediately
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', runChanges);
                  } else {
                    runChanges();
                  }
                  
                  // Run multiple times to catch dynamic content
                  setTimeout(runChanges, 100);
                  setTimeout(runChanges, 500);
                  setTimeout(runChanges, 1000);
                  setTimeout(runChanges, 2000);
                  setTimeout(runChanges, 3000);
                  setTimeout(runChanges, 5000);
                  
                  // MutationObserver for dynamic content
                  const observer = new MutationObserver(function(mutations) {
                    let shouldRun = false;
                    mutations.forEach(function(mutation) {
                      if (mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach(node => {
                          if (node.nodeType === 1) {
                            const localPickup = document.getElementById('local_pickup_methods');
                            if (localPickup && (localPickup.contains(node) || node.id === 'local_pickup_methods')) {
                              shouldRun = true;
                            }
                            // Also check if any added node contains the text we're looking for
                            if (node.textContent && (node.textContent.includes('PICK UP/BOOK YOUR OWN RIDER') || 
                                node.textContent.includes('FREE') || node.textContent.includes('Usually ready'))) {
                              shouldRun = true;
                            }
                          }
                        });
                      }
                    });
                    if (shouldRun) {
                      clearTimeout(observer.timeout);
                      observer.timeout = setTimeout(runChanges, 100);
                    }
                  });
                  
                  observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['class', 'style']
                  });
                  
                  console.log('\u2705 Checkout customization script initialized');
                })();
              `;let l=document.head||document.getElementsByTagName("head")[0]||document.body;l?(l.appendChild(r),console.log("\u2705 Checkout Extension: Script injected inline successfully")):console.error("\u274C Checkout Extension: Could not find target for script injection")}}else console.error("\u274C Checkout Extension: document is not available")}catch(r){console.error("\u274C Checkout Extension: Error injecting customization:",r),console.error("\u274C Checkout Extension: Error stack:",r.stack)}},100):console.error("\u274C Checkout Extension: setTimeout is not available")),S("s-block",{children:S("s-banner",{tone:"info",heading:"Pickup Information",children:S("s-stack",{gap:"base",children:[S("s-text",{size:"small",children:"Extension is running - Check console for logs"}),(t||n)&&S("s-stack",{gap:"tight",children:[t&&S("s-text",{size:"small",appearance:"accent",children:["\u{1F37D}\uFE0F Platter Pickup: ",t]}),n&&S("s-text",{size:"small",appearance:"accent",children:["\u{1F4E6} Other Items Pickup: ",n]})]})]})})})}shopify.extend("purchase.checkout.delivery-address.render-before",(...e)=>ce(...e));})();
//# sourceMappingURL=checkout-ui.js.map
