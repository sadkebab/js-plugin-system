export default function ({addHandler}) {
  addHandler(async () => {
    console.log('[plugin::fetcher] executing handler')
    const data = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    const json = await data.json() 
    console.log(json)
  })
}
export const meta = {
  name: 'fetcher',
  description: 'fetches stuff'
}