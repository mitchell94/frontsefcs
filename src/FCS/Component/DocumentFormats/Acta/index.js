import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import "./style.css";
function Acta(props) {
    let record = props.dataActa;

    let faculty = record.faculty;
    let program = record.program;
    let sede = record.campus;
    let course = record.Course.denomination;
    let credit = record.Course.credits;
    let typeCourse = record.Course.type;
    let teacher = record.teacher;
    let semester = record.semester;
    let actaDate = record.acta_date;
    let correlative = record.correlative;
    let totalStudent = record.totalStudent;
    let approvedStudent = record.approvedStudent;
    let desaprovedStudent = record.desaprovedStudent;
    let data = record.students;
    // MPT
    let ciclo = record.ciclo;

    // let record = data.dataRegistration.map((e) => {
    //     let d = [];
    //     if (e[2] !== "") {
    //         const [markNumber, markLetter] = e[2].split(" ");
    //         d = [e[0], e[1], markNumber, markLetter, e[3]];
    //     } else {
    //         d = [e[0], "", "", "", ""];
    //     }
    //     return d;
    // });

    useEffect(() => {
        window.print();
    }, [record]);

    return (
        <>
            {createPortal(
                <div className="print-page">
                    <div className="row bg-danger">
                        <div className="col-auto px-0">
                            <div className="image-unsm"></div>
                        </div>
                        <div className="col px-0">
                            <div className="d-flex justify-content-center unsm-name">
                                UNIVERSIDAD NACIONAL DE SAN MARTÍN
                            </div>
                            <div className="d-flex justify-content-center fcs-name">
                                FACULTAD DE CIENCIAS DE LA SALUD
                            </div>
                            <div className="d-flex justify-content-center use-name">
                                UNIDAD DE SEGUNDA ESPECIALIDAD
                            </div>
                        </div>
                        <div className="col-auto px-0">
                            <div className="image-fcs"></div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col px-0">
                            <div className="mt-3">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className="td-bold">CÓDIGO</td>
                                            <td className="td-bold px-2">:</td>
                                            <td className="td-normal">
                                                {correlative}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="td-bold">
                                                PROGRAMA
                                            </td>
                                            <td className="td-bold px-2">:</td>
                                            <td className="td-normal">
                                                {program}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="td-bold">
                                                FACULTAD
                                            </td>
                                            <td className="td-bold px-2">:</td>
                                            <td className="td-normal">
                                                {faculty}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="td-bold">SEDE</td>
                                            <td className="td-bold px-2">:</td>
                                            <td className="td-normal">
                                                {sede}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="td-bold">
                                                ASIGNATURA
                                            </td>
                                            <td className="td-bold px-2">:</td>
                                            <td className="td-normal">
                                                {course}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="td-bold">CICLO</td>
                                            <td className="td-bold px-2">:</td>
                                            <td className="td-normal">
                                                {ciclo}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="td-bold">DOCENTE</td>
                                            <td className="td-bold px-2">:</td>
                                            <td className="td-normal">
                                                {teacher}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

export default Acta;