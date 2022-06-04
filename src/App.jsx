import axios from "axios"
import { useEffect, useState,useRef } from "react"
import audio from './public/sound/correct.mp3'
import foco from './public/img/bombilla.png'
import { Spinner } from "react-bootstrap";
import Modals from "./components/Modals"
import './style/app.css'

function App() {
  const correct = new Audio(audio)
  const [paises, setPaises] = useState([])
  const [num, setnum] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [NombrePais, setNombrePais] = useState('')
  const [Puntaje, setPuntaje] = useState(0)
  const intento = useRef(1)
  async function ObtenerData() {
    try {
      const response = await axios('https://restcountries.com/v2/all')
      const data = response.data
      setPaises(data)
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    ObtenerData()
  }, [])
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  function empezar() {
    let a = getRandomInt(0, 249)
    setnum(a)
    procesarNombre(paises[a].translations.es)
  }
  function NewPais() {
    setInputValue('')
    correct.play()
    let a = getRandomInt(0, 249)
    setnum(a)
    if (intento.current>0) {
      intento.current=intento.current+1
      setPuntaje(Puntaje + (30+(10*intento.current))) 
    }else{
      intento.current=1
      setPuntaje(Puntaje + 30)
    }
    procesarNombre(paises[a].translations.es)
  }
  function verificEnter(e) {

    if (e.code === 'Enter') {
      e.preventDefault()
      verificInput()
    }
  }
  function verificInput() {
    
    let hecho = NombrePais.split(' ')
    let input = procesar(inputValue)
    let str = procesar(paises[num].translations.es)
    let length = str.split(' ').length
    if (procesar(NombrePais) !== str) {
      if (input === str) {
        setInputValue('')
        NewPais()
      } else {
        Puntaje - 5 <= 0 ? setPuntaje(0) : setPuntaje(Puntaje - 5)
        intento.current=0
        for (let i = 0; i < length; i++) {
          if (input === str.split(' ')[i] && hecho[i] !== str.split(' ')[i]) {
            let f=0
            NombrePais.split(' ')[i].split('').forEach((e) => {
              if (e.toString() === '_') {
                f++
              }
            });
            setPuntaje(Puntaje + (f * 5))
            hecho[i] = input
            setNombrePais(hecho.join(' '))
            correct.play()
            setInputValue('')
            
            
          }
          if (hecho.join(' ') === str) {
            NewPais()
          }
        }

      }
    } else {
      NewPais()
    }
  }
  const remAcent = (str) => {
    const acentos = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U', ',': '', '.': '', '(': '', ')': '','-':' ' };
    return str.split('').map(letra => acentos[letra] || letra).join('').toString();
  }
  function procesar(str) {
    return remAcent(str.toUpperCase().trim())
  }
  function procesarNombre(str) {

    let a = str.length
    let newstr = ''
    for (let i = 0; i < a; i++) {
      if (str[i] === ' ') {
        newstr += str[i]
      } else {
        if (i % 2 === 0) {
          newstr += '_'
        } else {
          if (getRandomInt(0, 4) === 1) {
            newstr += '_'
          } else {
            newstr += str[i]
          }
        }
      }
    }
    setNombrePais(procesar(newstr))
  }
  function resolverNombre() {
    intento.current=0
    Puntaje - 10 <= 0 ? setPuntaje(0) : setPuntaje(Puntaje - 10)
    let str = NombrePais
    let a = str.length
    let nombreOg = paises[num].translations.es
    let newstr = ''
    let x = Math.floor(Math.random() * (a - 0)) + 0;
    if (procesar(nombreOg) !== str) {
      if (str[x] !== " ") {
        if (str[x] === "_") {
          for (let i = 0; i < a; i++) {
            if (i === x) {
              newstr += nombreOg[i]
            } else {
              newstr += str[i]
            }
          }
          setNombrePais(procesar(newstr))
        } else {
          resolverNombre()
        }
      } else {
        resolverNombre()
      }
    } else {
      NewPais()
    }
  }

  return (

    <div className="font-monospace min-vh-100 d-flex justify-content-center align-items-start align-items-sm-center bg-piramide">
      {paises[0] ?
        !NombrePais ?
          <div className=" d-flex flex-column justify-content-center">
            <h1 className="m-5 mt-0-sm mt-5 text-center">La mejor trivia sobre paises</h1>
            <div className="d-flex justify-content-center">
              <button className="mt-5  px-5 btn btn-warning" onClick={empezar}>Empezar</button>
            </div>
          </div>
          :

          <div className="card mt-3 mt-0-sm border-light shadow-sm" style={{ width: "18rem" }}>
            <p className="p-1 pe-2 puntaje position-absolute top-0 start-0 bg-light">Puntaje:<span className={intento.current>1?`text-success`:''}>{Puntaje}</span></p>
            <img src={foco} onClick={resolverNombre} className="m-1 position-absolute top-0 end-0 bombilla" />
            <img src={paises[num].flags.png} height={"160"} className="card-img-top" alt="Bandera" />
            <div className="card-body">
              <h5 className="card-title  letter-spacing text-center mb-3">{NombrePais}</h5>
              <textarea style={{ resize: "none" }} rows={2} className="form-control text-uppercase" type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={verificEnter} />
              <div className="btn-group mt-2 w-100">
                <Modals paises={paises} num={num} />
                <button className="btn btn-warning" onClick={verificInput}>Verificar</button>
              </div>
            </div>
          </div>

        :
        <div className="d-flex align-items-end mt-5 mt-0-sm">
          <h5 className="m-0 me-2 align-self-center">Cargando</h5>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      }
    </div>

  )
}


export default App
