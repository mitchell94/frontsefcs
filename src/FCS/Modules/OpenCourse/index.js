import React, {Component} from 'react';
import {Button, Card, Col, Dropdown, Form, OverlayTrigger, Row, Tooltip} from 'react-bootstrap';
import Workload from './Workload';

import crypt from 'node-cryptex';
import app from "../../Constants";
import axios from "axios";
import PNotify from "pnotify/dist/es/PNotify";
import moment from 'moment';
import 'moment/locale/es';

import $ from 'jquery';

moment.locale('es');
const k = new Buffer(32);
const v = new Buffer(16);
const info = localStorage.getItem('INFO') ? JSON.parse(crypt.decrypt(localStorage.getItem('INFO'), k, v)) : '';

export default class OpenCourse extends Component {
    state = {
        isVaryingConcepts: false,
        organicUnit: info.role ? info.role.id_organic_unit : null,
        defaultSwitch: false,
        academicSemester: "",
        program: '',
        mention: '',
        programMask: '',
        mentionMask: '',

        programs: [],
        mentions: [],
        semesterCourses: [],
        academicCalendars: "",
        action: 'add',

        loaderDatailModal: false,
        modalDetail: false,
        actionModalDetail: 'add',


    };

    componentDidMount() {
         this.getProgram(this.state.organicUnit);
         this.getActualSemester();
    };

    // obtiene el semestre actual
    getActualSemester() {
        const url = app.general + '/' + app.academicCalendar + '/' + app.openCourse;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({
                    academicCalendars: res.data,
                    academicSemester: res.data.Academic_semester.id
                })
            }
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Error al cargar calendario",
                delay: 2000
            });
            console.log(err);
        })
    };

    // obtiene los programas por id de unidad_organica
    getProgram(id) {
        const url = app.programs + '/' + app.program + '/' + app.organicUnit + '/' + id;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({programs: res.data});
            }
        }).catch(err => {
            console.log(err);
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
        })
    };

    //obtiene los menciones segun el programa
    getMention(id) {
        const url = app.programs + '/' + app.mention + '/' + id;
        axios.get(url, app.headers).then(res => {
            if (res.data) this.setState({mentions: res.data});
        }).catch(err => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
            console.log(err)
        })
    };
    // obtiene los semestres y cursos de la mencion y si estan aperteurados segun el id del semestre
    getMentionSemesterCourse(idMention) {
        const url = app.programs + '/' + app.semesterMention + '/' + app.course + '/' + idMention + '/' + this.state.academicSemester;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({semesterCourses: res.data});
            }else{

            }
        }).catch(err => {
            console.log(err);
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
        })
    };

    // obtiene los semestres y cursos de la mencion y si estan aperteurados segun el id del semestre
    getMentionSemesterCourse(idMention) {
        const url = app.programs + '/' + app.semesterMention + '/' + app.course + '/' + idMention + '/' + this.state.academicSemester;
        axios.get(url, app.headers).then(res => {
            if (res.data) {
                this.setState({semesterCourses: res.data});
            }else{

            }
        }).catch(err => {
            console.log(err);
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
        })
    };

    //CAMBIA EL ESTASDO DE APERTURA
    toogleOpenCourse(idOpenCourse) {
        const url = app.registration + '/' + app.openCourse + '/' + idOpenCourse;
        let data = new FormData();
        axios.patch(url, data, app.headers).then(() => {
            PNotify.success({
                title: "Finalizado",
                text: "Registro actualizado correctamente",
                delay: 2000
            });
            this.getMentionSemesterCourse(this.state.mention);

        }).catch(() => {
            PNotify.error({
                title: "Oh no!",
                text: "Ha ocurrido un error",
                delay: 2000
            });
        });
    };

    //REGISTRA LA APERTURA
    saveOpenCourse(idCourse) {
        const url = app.registration + '/' + app.openCourse;
        const {denomination, academicSemester} = this.state;
        if (denomination !== '' && academicSemester !== '') {

            let data = new FormData();
            data.set('id_course', idCourse);
            data.set('id_semester', academicSemester);
            axios.post(url, data, app.headers).then(() => {
                this.getMentionSemesterCourse(this.state.mention);
                PNotify.success({
                    title: "Finalizado",
                    text: "Datos registrados correctamente",
                    delay: 2000
                });
            }).catch(() => {
                PNotify.error({
                    title: "Oh no!",
                    text: "Ha ocurrido un error",
                    delay: 2000
                });
            });
        } else {
            PNotify.notice({
                title: "Advertencia!",
                text: "Complete los campos obligatorios",
                delay: 2000
            });
        }

    };


    // FRONT FUNCTIONS
    handleChange = field => event => {
        switch (field) {
            case 'program':
                // var masks = event.target.childNodes[event.target.value].getAttribute('data-name') || '';
                if (event.target.value !== 'false') {


                    let masks = $('#program-' + event.target.value).attr('data-program');
                    this.setState({program: event.target.value, programMask: masks});
                    this.getMention(event.target.value);

                }


                break;
            case 'mention':
                // var mask = event.target.childNodes[event.target.value].getAttribute('data-name') || '';
                if (event.target.value !== 'false') {
                    let mask = $('#mention-' + event.target.value).attr('data-mention');
                    this.setState({mention: event.target.value, mentionMask: mask});
                    this.getMentionSemesterCourse(event.target.value);

                }


                break;
            case 'province':
                this.setState({province: event.target.value, district: ''});
                this.getDistrict(event.target.value);
                break;
            case 'district':
                this.setState({district: event.target.value});
                break;
            case 'type':
                this.setState({type: event.target.value});
                break;
            case 'cashBox':
                this.getInitialBalance(event.target.value);
                // this.getCashBoxFlow(event.target.value);
                this.setState({cashBox: event.target.value});

                break;
            case 'initialBalance':
                this.setState({
                    initialBalance: event.target.value.substr(4).replace(",", ""),
                    initialBalanceMask: event.target.value
                });

                break;

            default:
                break;
        }
    };
    //CAMBIA EL ESTADO
    validateState = state => {
        if (state) {
            return state.state;
        } else {
            return false;
        }
    };


    handleKeyPress = (e) => {
        // alert(this.state.actionInitialBalance)
        if (e.key === 'Enter') {
            this.state.actionInitialBalance === 'add' ?
                this.saveInitialBalance() : this.updateInitialBalance()
        }
    };

    handleCloseModal = () => {
        this.setState({
            // isVaryingCampus: false,
            actionInitialBalance: 'add',

        })
    };


    render() {
        const {
            organicUnit,
        } = this.state;

        const {program, mention, programMask, mentionMask} = this.state;
        const {programs, mentions, semesterCourses, academicCalendars} = this.state;

        return (
            <>

                        <Row>
                            <Col xl={3}>
                                <Card>
                                    <Card.Header className="bg-facebook order-card">
                                        <h4 className="text-white" >{academicCalendars.Academic_semester ? academicCalendars.Academic_semester.denomination : ""}</h4>
                                        <p className="m-b-0">{academicCalendars ? academicCalendars.denomination : ""}</p>
                                        <i className="feather icon-clock card-icon"/>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <div
                                                className="d-inline-block align-middle col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">



                                                <Row>
                                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        <Form.Group className="form-group fill">

                                                            <Form.Control as="select"
                                                                          style={{fontSize: '15px'}}
                                                                          value={program}
                                                                          onChange={this.handleChange('program')}>
                                                                >
                                                                <option defaultValue={true} hidden>Por favor seleccione
                                                                    un Programa</option>
                                                                {
                                                                    programs.length > 0 ?
                                                                        programs.map((program, index) => {
                                                                            if (program.state) {
                                                                                return (
                                                                                    <option id={'program-' + program.id} value={program.id} data-program={program.denomination}
                                                                                            key={index}>
                                                                                        {program.denomination}
                                                                                    </option>
                                                                                )
                                                                            } else {
                                                                                return null
                                                                            }
                                                                        }) :
                                                                        <option value={false}>No se encontraron datos</option>
                                                                }
                                                            </Form.Control>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        <Form.Group className="form-group fill">
                                                            <Form.Control as="select"
                                                                          style={{fontSize: '16px'}}
                                                                          value={mention}
                                                                          onChange={this.handleChange('mention')}>
                                                                >
                                                                <option defaultValue={true} hidden>Por favor seleccione
                                                                    una Mención</option>
                                                                {
                                                                    mentions.length > 0 ?
                                                                        mentions.map((mention, index) => {
                                                                            if (mention.state) {
                                                                                return (
                                                                                    <option id={'mention-' + mention.id} value={mention.id} data-mention={mention.denomination}
                                                                                            key={index}>
                                                                                        {mention.denomination}
                                                                                    </option>
                                                                                )
                                                                            } else {
                                                                                return null
                                                                            }
                                                                        }) :
                                                                        <option value={false}>No se encontraron datos</option>
                                                                }
                                                            </Form.Control>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </div>

                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xl={6}>
                                <Card>
                                    <Card.Body>
                                        <div className="d-inline-block align-middle">
                                            <div className="d-inline-block">
                                                {
                                                    (program !== '') && (mention !== '') ?
                                                        <h5>PROGRAMA
                                                            DE {programMask + ' CON MENCION EN  ' + mentionMask} </h5>
                                                        : <h5>PROGRAMA DE ESTUDIOS</h5>
                                                }

                                                <p className="m-b-0">Aperture cursos, Registre horarios y grupos,
                                                    Aisigne Docentes al curso</p>

                                            </div>
                                        </div>



                                    </Card.Body>
                                </Card>
                                <Row>
                                    {semesterCourses.length > 0 ?
                                        semesterCourses.map((r, index) => {

                                            return (
                                                <Col key={index} md={12} className='mt-n2'>
                                                    <Card className='card-border-c-blue'>
                                                        <Card.Header className='h-40' style={{height: '40px'}}>

                                                            <h6 className="mt-n2">{r.semester}</h6>

                                                        </Card.Header>
                                                        <Card.Body className='card-task'>
                                                            <Row>
                                                                {
                                                                    r.Course.length > 0 ?
                                                                        r.Course.map((k, i) => {
                                                                            return (
                                                                                <Col key={i} md={12}>
                                                                                    <div
                                                                                        className="d-inline-block align-middle">
                                                                                        <div className="d-inline-block">
                                                                                            <Card.Text
                                                                                                className='task-detail'>{k.denomination}</Card.Text>

                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="pull-right">
                                                                                        <OverlayTrigger
                                                                                            overlay={
                                                                                                <Tooltip>Acciones</Tooltip>}>
                                                                                            <Dropdown alignRight={true}
                                                                                                      className="pull-right mr-n4 mt-n1">
                                                                                                <Dropdown.Toggle
                                                                                                    className="btn-icon"
                                                                                                    style={{
                                                                                                        border: 'none',
                                                                                                        background: 'none',
                                                                                                        outline: 'none',
                                                                                                        color: 'white',
                                                                                                        height: '5px'

                                                                                                    }}>
                                                                                                    <i
                                                                                                        className="material-icons pull-right mr-n2 mt-n1"
                                                                                                        style={{color: '#6c757d'}}>more_vert</i>
                                                                                                </Dropdown.Toggle>
                                                                                                <Dropdown.Menu as='ul'
                                                                                                               className="list-unstyled card-option">
                                                                                                    <Dropdown.Item
                                                                                                        as='li'
                                                                                                        onClick={() => this.Workload.handleOpenModal(k)}
                                                                                                        className="dropdown-item">

                                                                                     <span type="button">
                                                                                         <i
                                                                                             className={'feather icon-clock'}/> Carga horaria
                                                                                         </span>
                                                                                                    </Dropdown.Item>


                                                                                                </Dropdown.Menu>
                                                                                            </Dropdown>
                                                                                        </OverlayTrigger>


                                                                                        <Form.Group
                                                                                            className="pull-right mr-n1 mt-n2">
                                                                                            <div
                                                                                                onClick={
                                                                                                    k.Open_course
                                                                                                        ? () => this.toogleOpenCourse(k.Open_course.id)
                                                                                                        : () => this.saveOpenCourse(k.id)
                                                                                                }
                                                                                                className="switch switch-success d-inline m-r-10">

                                                                                                <Form.Control
                                                                                                    type="checkbox"
                                                                                                    id={i}
                                                                                                    readOnly
                                                                                                    checked={this.validateState(k.Open_course)}
                                                                                                    value={this.validateState(k.Open_course)}

                                                                                                />
                                                                                                <Form.Label
                                                                                                    htmlFor="checked-default"
                                                                                                    className="cr"/>
                                                                                            </div>

                                                                                        </Form.Group>

                                                                                    </div>
                                                                                    <hr className="mt-3 mb-1"/>


                                                                                </Col>)
                                                                        })
                                                                        :
                                                                        <Col md={12}>
                                                                            No hay cursos registrados
                                                                        </Col>


                                                                }


                                                            </Row>


                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            )

                                        })


                                        :
                                        <Col md={12}>
                                            ''
                                        </Col>
                                    }


                                </Row>
                            </Col>
                        </Row>

                        <Workload
                            ref={(ref) => this.Workload = ref}
                        />





            </>
        )
    }
}
