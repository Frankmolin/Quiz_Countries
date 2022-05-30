import axios from "axios"
import { useEffect, useState } from "react"
import audio from './public/sound/correct.mp3'
import foco from './public/img/bombilla.png'
import { Spinner } from "react-bootstrap";
import './style/app.css'

function App() {
  const correct=new Audio(audio)
  const [paises, setPaises] = useState([])
  const [num, setnum] = useState(0)
  const [value, setvalue] = useState('')
  const [NombrePais, setNombrePais] = useState('')
  const [Puntaje, setPuntaje] = useState(0)
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
    correct.play()
    let a = getRandomInt(0, 249)
    setnum(a)
    setPuntaje(Puntaje+1)
    procesarNombre(paises[a].translations.es)
  }
  const update = (e) => {
    setvalue(e.target.value.toUpperCase())
  }
  function verificEnter(e) {

    if (e.code === 'Enter') {
      e.preventDefault()
      verificInput()
    }
  }
  function verificInput() {
    if (procesar(value) === procesar(paises[num].translations.es)) {
      console.log(`correcto`)
      setvalue('')
      NewPais()
    } else {
      console.log('inco')
    }
  }
  const remAcent = (str) => {
    const acentos = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U' };
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
    setPuntaje(0)
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

    <div className="font-monospace min-vh-100 d-flex justify-content-center align-items-center bg-custom">
      {paises[0] ?
        !NombrePais ?
          <div className=" d-flex flex-column ">

            <h1 className="m-5 mt-0">La mejor trivia sobre paises</h1>

            <div className="d-flex justify-content-center">

              <button className="mt-5  px-5 btn btn-warning" onClick={empezar}>Empezar</button>

            </div>
          </div>
          :
          <div className="card border-light shadow-sm" style={{ width: "18rem" }}>
            <p className="p-1 pe-2 puntaje position-absolute top-0 start-0 bg-light fw-bold">Puntaje:{Puntaje}</p>
              <img src={foco} onClick={resolverNombre} className="m-1 position-absolute top-0 end-0 bombilla" />
            <img src={paises[num].flags.png} height={"160"} className="card-img-top" alt="Bandera" />
            <div className="card-body">
              <h5 className="card-title letter-spacing text-center mb-3">{NombrePais}</h5>
              <p className="card-text mb-0">Pais <strong>Nº{num + 1}.</strong></p>
              <p className="card-text mb-0"> Su capital es:</p>
              <p className="card-text ">{paises[num].capital ? <span className="text-success">{paises[num].capital}</span> : <strong className="text-danger">Este pais no tiene capital</strong>}</p>
              <textarea style={{ resize: "none" }} rows={2} className="form-control" type="text" value={value} onKeyDown={verificEnter} onChange={update} />
              <div className="btn-group mt-3 d-flex justify-content-center">
                <button className="btn btn-warning" onClick={verificInput}>Verificar</button>

              </div>
            </div>
          </div>
        :
        <div className="d-flex align-items-end">
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
