(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{"8Aud":function(e,n,t){"use strict";t.d(n,"a",(function(){return s}));var r=t("q1tI"),a=t("NKCw"),s=function(e){var n=e.as,t=e.errors,s=e.name,u=e.message,o=e.render,c=function(e,n){if(null==e)return{};var t,r,a={},s=Object.keys(e);for(r=0;r<s.length;r++)n.indexOf(t=s[r])>=0||(a[t]=e[t]);return a}(e,["as","errors","name","message","render"]),i=Object(a.c)(),l=Object(a.a)(t||i.errors,s);if(!l)return null;var m=l.message,d=l.types,f=Object.assign({},c,{children:m||u});return Object(r.isValidElement)(n)?Object(r.cloneElement)(n,f):o?o({message:m||u,messages:d}):Object(r.createElement)(n||r.Fragment,f)}},Bl7J:function(e,n,t){"use strict";var r=t("q1tI"),a=t.n(r),s=t("Wbzz");n.a=function(e){var n=e.children,t=e.style;return a.a.createElement("div",{id:"layout",style:t},a.a.createElement("div",{id:"navbar"},a.a.createElement(s.a,{to:"/"},"Home"),a.a.createElement(s.a,{to:"/settings"},"Settings")),n)}},pM26:function(e,n,t){"use strict";t.r(n);var r=t("o0o1"),a=t.n(r),s=(t("ls82"),t("HaE+")),u=t("q1tI"),o=t.n(u),c=t("Bl7J"),i=t("Xj0o"),l=t("bfiW"),m=t("Wbzz"),d=t("NKCw"),f=t("8Aud"),p=t("IP2g"),E=t("wHSu");n.default=function(){var e=o.a.useState(),n=e[0],r=e[1],u=o.a.useContext(i.Context),b=u.user,h=u.setUser,g=u.token,y=u.socket,v=u.setConnectedUsers,w=Object(d.b)(),C=w.handleSubmit,j=(w.reset,w.errors),S=w.setError,k=w.register,O={filter:n&&"blur(5px)",pointerEvents:n&&"none"};o.a.useEffect((function(){return y.on("connectedUsers",(function(e){return v(e)})),y.on("message",(function(e){h(e)})),y.on("entering",(function(e){return h(e)})),function(){return y.off()}}),[]);var x=function(){var e=Object(s.a)(a.a.mark((function e(n){var s,u,o;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Promise.resolve().then(t.t.bind(null,"vDqi",7));case 2:return s=e.sent,e.next=5,t.e(1).then(t.t.bind(null,"Qyje",7));case 5:return u=e.sent,o=b.friends.find((function(e){return e.uname===n.uname})),e.next=9,s.get(l.a+"/chatters?"+u.stringify({_where:{uname:n.uname}}),{headers:{Authorization:"Bearer "+g}});case 9:e.sent.data[0]?o?S("uname",{type:"random",message:"He is already your friend"}):n.uname===b.uname?S("uname",{type:"random",message:"That's your own username"}):(h((function(e){return e.friends.push({uname:n.uname,messagesSentToMe:[],messagesSentByMe:[]}),Object.assign({},e,{dontUpdate:!1})})),r(!1)):S("uname",{type:"random",message:"User doesn't exist"});case 11:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),_=function(){var e=Object(s.a)(a.a.mark((function e(n){var s,u;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Promise.resolve().then(t.t.bind(null,"vDqi",7));case 2:return s=e.sent,e.next=5,t.e(1).then(t.t.bind(null,"Qyje",7));case 5:return u=e.sent,e.next=8,s.get(l.a+"/chatters?"+u.stringify({_where:{uname:n.uname}}),{headers:{Authorization:"Bearer "+g}});case 8:e.sent.data[0]?S("uname",{type:"random",message:"Please choose a different username"}):(h((function(e){return Object.assign({},e,{uname:n.uname,dontUpdate:!1})})),r(!1));case 10:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),q=function(e){e.current_pass!==b.pass?S("current_pass",{type:"random",message:"Invalid password"}):e.new_pass!==e.conf_pass?S("conf_pass",{type:"random",message:"Passwords don't match"}):(h((function(n){return Object.assign({},n,{pass:e.new_pass,dontUpdate:!1})})),r(!1))};return b?o.a.createElement(c.a,null,o.a.createElement("div",{id:"settings"},o.a.createElement("button",{onClick:function(){return r("add-friend")},style:O},o.a.createElement("h3",null,"Add a friend"),o.a.createElement(p.a,{icon:E.f})),o.a.createElement("div",{style:O},o.a.createElement("h3",null,"Username"),o.a.createElement("h3",null,b.uname),o.a.createElement(p.a,{icon:E.e,onClick:function(){return r("uname")}})),o.a.createElement("div",{style:O},o.a.createElement("h3",null,"Password"),o.a.createElement("h3",null,"**********"),o.a.createElement(p.a,{icon:E.e,onClick:function(){return r("pass")}})),o.a.createElement("button",{style:O,onClick:function(){return h(null)&localStorage.removeItem("token")&Object(m.c)("/login")}},o.a.createElement("h3",null,"Logout"),o.a.createElement(p.a,{icon:E.d})),function(){switch(n){case"add-friend":return o.a.createElement("form",{onSubmit:C(x)},o.a.createElement("input",{name:"uname",placeholder:"John Doe",ref:k({required:!0})}),o.a.createElement(f.a,{errors:j,name:"uname",style:{fontSize:"0.75rem",color:"#EF7B6C"},as:"p"}),o.a.createElement("button",{type:"submit"}," Submit "),o.a.createElement("button",{onClick:function(){return r(!1)}}," Cancel "));case"uname":return o.a.createElement("form",{onSubmit:C(_)},o.a.createElement("input",{name:"uname",placeholder:"New Username",ref:k({required:!0})}),o.a.createElement(f.a,{errors:j,name:"uname",style:{fontSize:"0.75rem",color:"#EF7B6C"},as:"p"}),o.a.createElement("button",{type:"submit"}," Submit "),o.a.createElement("button",{onClick:function(){return r(!1)}}," Cancel "));case"pass":return o.a.createElement("form",{onSubmit:C(q)},o.a.createElement("input",{name:"current_pass",placeholder:"Current Password",ref:k({required:!0})}),o.a.createElement(f.a,{errors:j,name:"current_pass",style:{fontSize:"0.75rem",color:"#EF7B6C"},as:"p"}),o.a.createElement("input",{name:"new_pass",placeholder:"New Password",ref:k({required:!0})}),o.a.createElement("input",{name:"conf_pass",placeholder:"Confirm Password",ref:k({required:!0})}),o.a.createElement(f.a,{errors:j,name:"conf_pass",style:{fontSize:"0.75rem",color:"#EF7B6C"},as:"p"}),o.a.createElement("button",{type:"submit"}," Submit "),o.a.createElement("button",{onClick:function(){return r(!1)}}," Cancel "))}}())):l.e}}}]);
//# sourceMappingURL=component---src-pages-settings-js-6cb1b1e6c7bef4a3ecb5.js.map