import React from "react";
import {
    Button,
    Col,
    Form,
    Modal,
    OverlayTrigger,
    Row,
    Tooltip,
} from "react-bootstrap";

import defaultPhoto from "../../../../assets/images/user/default.jpg";
import app from "../../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";

import moment from "moment";
import "moment/locale/es";
import $ from "jquery";
import Close from "@material-ui/icons/Close";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

moment.locale("es");

class FormChangeProgram extends React.Component {
    state = {
        listPrograms: [],
        programId: "",
    };

    componentDidMount() {}

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.stateModal !== this.props.stateModal) {
            this.setState({
                stateModal: this.props.stateModal,
                listPrograms: this.props.listPrograms,
            });
        }
    }

    closeModal = () => {
        this.props.closeModal();
    };

    // METODOS DE CONSULTA
    async toListAdmissionPlan(id_program) {
        this.setState({ admissionPlanLoader: true });
        const url =
            app.programs +
            "/" +
            app.admissionPlan +
            "/" +
            app.program +
            "/" +
            id_program +
            "/s";
        try {
            const res = await axios.get(url, app.headers);
            if (res.data !== "") {
                this.setState({ admissionPlans: res.data });
                console.log(res.data);
            }
            this.setState({ admissionPlanLoader: false });
        } catch (err) {
            this.setState({ admissionPlanLoader: false });
            console.log(err);
        }
    }

    handleChange = (field) => (event) => {
        switch (field) {
            case "programId":
                this.toListAdmissionPlan(event.target.value);
                break;
            default:
                break;
        }
    };

    render() {
        const {
            stateModal,
            listPrograms,
            programId,
            admissionPlans,
            admissionPlan,
        } = this.state;

        return (
            <Modal
                show={stateModal}
                size={"lg"}
                backdrop="static"
                style={{ zIndex: "100000" }}
            >
                <Modal.Header className="bg-primary">
                    <Modal.Title as="h5" style={{ color: "#ffffff" }}>
                        CAMBIAR DE PROGRAMA
                    </Modal.Title>
                    <div className="d-inline-block pull-right">
                        <OverlayTrigger
                            overlay={
                                <Tooltip style={{ zIndex: 100000000 }}>
                                    Cerrar
                                </Tooltip>
                            }
                        >
                            <Close
                                style={{ color: "white" }}
                                onClick={() => this.closeModal()}
                            />
                        </OverlayTrigger>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Form.Group className="form-group fill">
                                <Form.Label
                                    className="floating-label"
                                    style={
                                        programId === ""
                                            ? { color: "#ff5252 " }
                                            : null
                                    }
                                >
                                    Programa
                                    <small className="text-danger"> *</small>
                                </Form.Label>
                                <Form.Control
                                    as="select"
                                    value={programId}
                                    onChange={this.handleChange("programId")}
                                >
                                    <option defaultValue={true} hidden>
                                        Programa
                                    </option>
                                    {listPrograms.length > 0 ? (
                                        listPrograms.map((r, k) => {
                                            return (
                                                <option
                                                    id={"programmask-" + r.id}
                                                    dataprogrammask={
                                                        r.denomination
                                                    }
                                                    value={r.id}
                                                    key={k}
                                                >
                                                    {" "}
                                                    {r.denomination}{" "}
                                                </option>
                                            );
                                        })
                                    ) : (
                                        <option value={false} disabled>
                                            No se encontraron datos
                                        </option>
                                    )}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        {/* <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">
                                    Plan de admision
                                    <small className="text-danger"> *</small>
                                </Form.Label>
                                {this.state.admissionPlanLoader ? (
                                    <span
                                        className="spinner-border spinner-border-sm mr-1"
                                        role="status"
                                    />
                                ) : (
                                    <Form.Control
                                        as="select"
                                        value={admissionPlan}
                                        onChange={this.handleChange(
                                            "admissionPlan"
                                        )}
                                    >
                                        <option defaultValue={true} hidden>
                                            Plan de admision
                                        </option>
                                        {admissionPlans.length > 0 ? (
                                            admissionPlans.map((r, k) => (
                                                <option
                                                    id={"admissionPlan-" + r.id}
                                                    datastudyplan={r.id_plan}
                                                    dataprocess={r.id_process}
                                                    admissionplanmask={
                                                        r.description
                                                    }
                                                    datastudyplanmask={
                                                        r.Plan.description
                                                    }
                                                    value={r.id}
                                                    key={k}
                                                >
                                                    {" "}
                                                    {r.description}{" "}
                                                </option>
                                            ))
                                        ) : (
                                            <option value={false} disabled>
                                                No se encontraron datos
                                            </option>
                                        )}
                                    </Form.Control>
                                )}
                            </Form.Group>
                        </Col> */}
                        {/* <Col xs={12} sm={12} md={3} lg={3} xl={3}>
                            <Form.Group className="form-group fill">
                                <Form.Label className="floating-label">
                                    Plande de estudio{" "}
                                    <small className="text-danger"> *</small>
                                </Form.Label>

                                <Form.Control
                                    type="text"
                                    placeholder="Plan de estudio"
                                    id="studyPlanMask"
                                    value={studyPlanMask}
                                    disabled={true}
                                />
                            </Form.Group>
                        </Col> */}
                    </Row>
                    MODAL PARA CAMBIO DE PROGRAMA
                </Modal.Body>
            </Modal>
        );
    }
}

export default FormChangeProgram;
