import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Main from './Pages/Main/Main';
import Turma from './Pages/Turma/Turma';
import AddEquipe from './Pages/AddEquipe/AddEquipe';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Main} />
      <Route path="/turma/:id/add" component={AddEquipe} />
      <Route path="/turma/:id" component={Turma} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
