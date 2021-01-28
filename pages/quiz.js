import React from 'react';
import db from '../db.json';

import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';
import QuizLogo from '../src/components/QuizLogo';
import Widget from '../src/components/Widget';
import Button from '../src/components/Button';
import GitHubCorner from '../src/components/GitHubCorner';
import Spinner from '../src/components/Spinner';

function quiz() {
  const screenStates = {
    LOADING: 'LOADING',
    QUIZ: 'QUIZ',
    RESULTADO: 'RESULTADO',
  };

  const [screenState, setScreenState] = React.useState(screenStates.QUIZ);
  const [acertos, setAcertos] = React.useState(0);
  const [totalQuestoes, setTotalQuestoes] = React.useState(0);

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />
        {screenState === screenStates.QUIZ && (
          <Widget>
            <Widget.Header>
              <h1>{db.title}</h1>
            </Widget.Header>
            <Widget.Content>
              <p>{db.description}</p>
              <form onSubmit={handleSubmit}>
                <Button type="submit">CONFIRMAR</Button>
              </form>
            </Widget.Content>
          </Widget>
        )}
        {screenState === screenStates.LOADING && (
          <Widget>
            <Widget.Header>
              <h1>CARREGANDO...</h1>
            </Widget.Header>
            <Widget.Content style={{ height: '80px' }}>
              <Spinner />
            </Widget.Content>
          </Widget>
        )}

        {screenState === screenStates.RESULTADO && (
          <Widget>
            <Widget.Header>
              <h1>RESULTADO</h1>
            </Widget.Header>
            <Widget.Content>
              {`Você acertou ${acertos} de ${totalQuestoes} perguntas! PARABÉNS`}
            </Widget.Content>
          </Widget>
        )}
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/pedroarch" />
    </QuizBackground>
  );
}

export default quiz;
