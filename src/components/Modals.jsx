import { Modal, Button } from "react-bootstrap";
import { useState } from "react"


function Modals({ paises, num }) {
    const values = 'md-down';
    const [fullscreen, setFullscreen] = useState(true);
    const [show, setShow] = useState(false);

    const traslate = (str) => {
        const subregions = { 'Middle Africa': 'África central', 'Northern Europe': 'Norte de Europa', 'Caribbean': 'caribe', 'Polynesia': 'Polinesia', 'Central America': 'Centroamérica', 'Central Asia': 'Asia Central', 'Western Asia': 'Asia occidental', 'Australia and New Zealand': 'Australia y Nueva Zelanda', 'Southern Africa': 'Africa del Sur', 'Western Africa': 'África Occidental', 'Eastern Asia': 'Asia Oriental', 'Southern Asia': 'Asia meridional', 'South America': 'Sudamerica', 'Eastern Africa': 'África oriental', 'Northern Africa': 'Africa del Norte', 'Southern Europe': 'Europa del sur', 'Northern America': 'america del norte', 'South-Eastern Asia': 'Sureste de Asia', 'Melanesia': 'Melanesia', 'Micronesia': 'Micronesia', 'Eastern Europe': 'Europa del Este', 'Central Europe': 'Europa Central' }
        return (subregions[str] ? subregions[str] : str);
    }

    function handleShow(breakpoint) {
        setFullscreen(breakpoint);
        setShow(true);
    }

    return (
        <>

            <Button onClick={() => handleShow(values)}>
                Datos
            </Button>

            <Modal show={show} fullscreen={fullscreen} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Datos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                   <div className="container h-100 d-flex align-items-center justify-content-center">
                       
                        <table className="table table-borderless  table-bordered border-dark">
                            <thead>
                                <tr className="text-center">
                                    <th scope="col">Nº</th>
                                    <th scope="col">Capital</th>
                                    <th scope="col">Subregion</th>
                                    <th scope="col">Poblacion</th>
                                    <th scope="col">Independencia</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-primary">
                                    <th scope="row">{num + 1}</th>
                                    <td >{paises[num].capital ? paises[num].capital : <strong className="text-danger">Este pais no tiene capital</strong>}</td>
                                    <td>{traslate(paises[num].subregion)}</td>
                                    <td>{paises[num].population.toLocaleString('es')}</td>
                                    <td>{paises[num].independent?'Independiente':'Dependiente'}</td>
                                </tr>
                            </tbody>
                        </table>
                        
                   </div >
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Modals