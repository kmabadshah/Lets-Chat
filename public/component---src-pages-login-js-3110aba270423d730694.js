(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{"8Aud":function(e,t,n){"use strict";n.d(t,"a",(function(){return s}));var r=n("q1tI"),a=n("NKCw"),s=function(e){var t=e.as,n=e.errors,s=e.name,o=e.message,u=e.render,i=function(e,t){if(null==e)return{};var n,r,a={},s=Object.keys(e);for(r=0;r<s.length;r++)t.indexOf(n=s[r])>=0||(a[n]=e[n]);return a}(e,["as","errors","name","message","render"]),c=Object(a.c)(),l=Object(a.a)(n||c.errors,s);if(!l)return null;var m=l.message,d=l.types,f=Object.assign({},i,{children:m||o});return Object(r.isValidElement)(t)?Object(r.cloneElement)(t,f):u?u({message:m||o,messages:d}):Object(r.createElement)(t||r.Fragment,f)}},SGa5:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return f}));var r=n("o0o1"),a=n.n(r),s=(n("ls82"),n("HaE+")),o=n("q1tI"),u=n.n(o),i=n("bfiW"),c=n("Xj0o"),l=n("Wbzz"),m=n("8Aud"),d=n("NKCw");function f(){var e=u.a.useContext(c.Context),t=(e.isLoading,e.token),r=e.setUser,o=Object(d.b)(),f=o.handleSubmit,p=(o.reset,o.errors),g=o.setError,b=o.register,h=function(){var e=Object(s.a)(a.a.mark((function e(s){var o,u,c,m;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Promise.resolve().then(n.t.bind(null,"vDqi",7));case 2:return o=e.sent,e.next=5,n.e(1).then(n.t.bind(null,"Qyje",7));case 5:return u=e.sent,e.next=8,Promise.resolve().then(n.t.bind(null,"FLf1",7));case 8:return c=e.sent,e.next=11,o.get(i.a+"/chatters?"+u.stringify({_where:{uname:s.uname,pass:s.pass}}),{headers:{Authorization:"Bearer "+t}});case 11:(m=e.sent).data[0]?(r(m.data[0]),c.sign({uname:s.uname},i.f,(function(e,t){e?console.log(e):localStorage.setItem("token",t)})),Object(l.c)("/")):g("uname",{type:"random",message:"Invalid username or password"});case 13:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return u.a.useEffect((function(){console.log("login")}),[]),u.a.createElement("div",{id:"login"},u.a.createElement("form",{autoComplete:"off",onSubmit:f(h)},u.a.createElement("h1",null,"Let's Chat"),u.a.createElement("input",{name:"uname",autoComplete:"false",placeholder:"Username",ref:b({required:!0})}),u.a.createElement(m.a,{errors:p,name:"uname",style:{fontSize:"0.75rem",marginTop:"0.25rem",color:"#EF7B6C"},as:"p"}),u.a.createElement("input",{name:"pass",type:"password",autoComplete:"false",placeholder:"Password",ref:b({required:!0})}),u.a.createElement("div",null,u.a.createElement("input",{type:"submit",value:"Login"}),u.a.createElement(l.a,{to:"/signup"},"Sign Up"))))}}}]);
//# sourceMappingURL=component---src-pages-login-js-3110aba270423d730694.js.map