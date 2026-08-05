import type { ParentProps } from 'solid-js'

function App(props: ParentProps) {
  return <div id="app">{props.children}</div>
}

export default App
