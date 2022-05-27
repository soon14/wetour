export default function MapLoader(key) {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap)
    } else {
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'http://webapi.amap.com/maps?v=1.3&callback=initAMap&key=' + key + '&plugin=AMap.PolyEditor,AMap.MouseTool'
      script.onerror = reject
      document.head.appendChild(script)
    }
    window.initAMap = () => {
      resolve(window.AMap)
    }
  })
}
