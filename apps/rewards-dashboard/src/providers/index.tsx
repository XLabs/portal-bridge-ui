import { Web3Provider } from "./Web3Provider"


export const AppProvider = (props: {children: JSX.Element})=> {
  return <>
    <Web3Provider>
      {props.children}
    </Web3Provider>
  </>
}
