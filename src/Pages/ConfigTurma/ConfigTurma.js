import React from 'react';
import api from '../../Services/api';
import AreasForm from '../Components/AreasForm';

import { Grid, Select, MenuItem, InputLabel, FormControl, TextField, Paper, withStyles } from '@material-ui/core';
import TopBar from '../Components/TopBar';
import cursos from '../Cursos';
import Alert from '../Components/Alert';

const styles = theme => ({
  root: {
    background: theme.palette.lightPrimary.main,
    minHeight: '100vh'
  },
  formConfigTurmaPaper: {
    margin: theme.spacing(3, 0),
    paddingBottom: theme.spacing(4),
    borderRadius: '15px'
  },
  formConfigTurmaItem: {
    margin: theme.spacing(1, 5)
  }
});

export default withStyles(styles)(
  class ConfigTurma extends React.Component {
    state = {
      curso: '',
      cursoOutro: '',
      projeto: '',
      projetoOutro: '',
      semestre: '19-2',
      alertMissingData: false,
      alertAlreadyRegistered: false
    };

    formIsCompleted = () => {
      return (
        ((this.state.curso !== '' && this.state.curso !== 'Outro') || (this.state.curso === 'Outro' && this.state.cursoOutro !== '')) &&
        ((this.state.projeto !== '' && this.state.projeto !== 'Outro') ||
          (this.state.projeto === 'Outro' && this.state.projetoOutro !== ''))
      );
    };

    submitAreasFormCallback = async (areas, metricas) => {
      if (this.formIsCompleted()) {
        const cursoToSend = this.state.curso === 'Outro' ? this.state.cursoOutro : this.state.curso;
        const projetoToSend = this.state.projeto === 'Outro' ? this.state.projetoOutro : this.state.projeto;
        const turma = {
          curso: cursoToSend,
          projeto: projetoToSend,
          semestre: this.state.semestre,
          expectativa: { ...areas },
          metrica: { ...metricas }
        };
        await api
          .post('/turma', turma)
          .then(response => this.props.history.push(`/turma/${cursoToSend}/${projetoToSend}/${this.state.semestre}`))
          .catch(error => {
            if (error.response) {
              if (error.response.status === 400) {
                this.setState({ alertAlreadyRegistered: true });
              }
            } else {
              alert('Problema ao enviar dados ao servidor.');
            }
          });
      } else {
        this.setState({ alertMissingData: true });
      }
    };

    // TODO: TENTAR DEIXAR DATA DINÂMICA

    render() {
      const { classes } = this.props;
      return (
        <div className={classes.root}>
          <TopBar voltar title="Configurar Turma" history={this.props.history} />
          <AreasForm callback={this.submitAreasFormCallback} mostrarMetrica>
            <Grid container direction="row" justify="center">
              <Grid item xs={10} sm={6}>
                <Paper elevation={4} className={classes.formConfigTurmaPaper}>
                  <Grid container direction="column">
                    <FormControl className={classes.formConfigTurmaItem}>
                      <InputLabel>Curso</InputLabel>
                      <Select name="curso" value={this.state.curso} onChange={e => this.setState({ curso: e.target.value })}>
                        {cursos &&
                          Object.keys(cursos).map(curso => (
                            <MenuItem key={curso} value={curso}>
                              {curso}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>

                    {this.state.curso === 'Outro' && (
                      <FormControl className={classes.formConfigTurmaItem}>
                        <TextField
                          label="Nome do Curso"
                          value={this.state.cursoOutro}
                          onChange={e => this.setState({ cursoOutro: e.target.value })}
                          margin="normal"
                          variant="outlined"
                        />
                      </FormControl>
                    )}

                    <FormControl className={classes.formConfigTurmaItem}>
                      <InputLabel>Projeto</InputLabel>
                      <Select name="projeto" value={this.state.projeto} onChange={e => this.setState({ projeto: e.target.value })}>
                        {cursos[this.state.curso] ? (
                          cursos[this.state.curso].map(projeto => (
                            <MenuItem key={projeto} value={projeto}>
                              {projeto}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled value="">
                            Escolha um Curso Primeiro
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>

                    {this.state.projeto === 'Outro' && (
                      <FormControl className={classes.formConfigTurmaItem}>
                        <TextField
                          label="Nome do Projeto"
                          value={this.state.projetoOutro}
                          onChange={e => this.setState({ projetoOutro: e.target.value })}
                          margin="normal"
                          variant="outlined"
                        />
                      </FormControl>
                    )}

                    <FormControl className={classes.formConfigTurmaItem}>
                      <InputLabel>Semestre</InputLabel>
                      <Select name="semestre" value={this.state.semestre} onChange={e => this.setState({ semestre: e.target.value })}>
                        <MenuItem value="19-1">19/1</MenuItem>
                        <MenuItem value="19-2">19/2</MenuItem>
                        <MenuItem value="20-1">20/1</MenuItem>
                        <MenuItem value="20-2">20/2</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
            <Alert
              text="Preencha todos os campos primeiro"
              open={this.state.alertMissingData}
              handleClose={e => this.setState({ alertMissingData: false })}
            />
            <Alert
              text="Projeto já cadastrado no banco de dados"
              open={this.state.alertAlreadyRegistered}
              handleClose={e => this.setState({ alertAlreadyRegistered: false })}
            />
          </AreasForm>
        </div>
      );
    }
  }
);
