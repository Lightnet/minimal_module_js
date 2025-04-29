
# main
 This will set up render using the van.derive().

```js
import { NotifyManager } from "./components/notify/notify.js";

van.add(document.head, link({
  id:"index_style",
  rel:"stylesheet",
  type:"text/css",
  href:"/components/notify/notify.css"
}));

van.add(document.body, NotifyManager());
```


# Sent Notify
```js
//...
import { notify } from "./notify.js";
//...
function btnInfo(){
  notify({
    color:"info",
    content:"Test Info"
  })
}
//...
return div(
  button({onclick:btnInfo},'Test Info'),
)

```