import React from 'react';
import PropTypes from 'prop-types';
import db from '../db.json';

import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';
import QuizLogo from '../src/components/QuizLogo';
import Widget from '../src/components/Widget';
import Button from '../src/components/Button';
import GitHubCorner from '../src/components/GitHubCorner';
import Spinner from '../src/components/Spinner';

function QuestionWidget({
  onSubmit,
  questaoAtual,
  totalQuestoes,
  questaoIndex,
}) {
  return (
    <Widget>
      <Widget.Header>
        { `Pergunta ${questaoIndex + 1} de ${totalQuestoes}` }
      </Widget.Header>
      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        src={questaoAtual.image}
      />
      <Widget.Content>
        <h2>{questaoAtual.title}</h2>
        <p>{questaoAtual.description}</p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          {questaoAtual.alternatives.map((alternativa, index) => (
            <Widget.Topic
              as="label"
              htmlFor={`alternative__${index}`}
              key={alternativa}
            >
              <input
              // style={{ display: 'none' }}
                id={`alternative__${index}`}
                name={`questao__${questaoIndex}`}
                type="radio"
                key={alternativa}
              />
              {alternativa}
            </Widget.Topic>
          ))}
          <Button type="submit">CONFIRMAR</Button>
        </form>
      </Widget.Content>
    </Widget>

  );
}

const screenStates = {
  LOADING: 'LOADING',
  QUIZ: 'QUIZ',
  RESULTADO: 'RESULTADO',
};

export default function Quiz() {
  const [screenState, setScreenState] = React.useState(screenStates.LOADING);
  const [acertos, setAcertos] = React.useState(0);
  const totalQuestoes = db.questions.length;
  const [questaoIndex, setQuestaoIndex] = React.useState(0);
  const questaoAtual = db.questions[questaoIndex];

  function handleSubmit() {
    const proximaQuestao = questaoIndex + 1;
    if (proximaQuestao < totalQuestoes) {
      setQuestaoIndex(proximaQuestao);
    } else {
      setScreenState(screenStates.RESULTADO);
    }
  }

  React.useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1000);
  }, []);

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />
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

        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            onSubmit={handleSubmit}
            questaoAtual={questaoAtual}
            questaoIndex={questaoIndex}
            totalQuestoes={totalQuestoes}
          />
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

QuestionWidget.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  totalQuestoes: PropTypes.number.isRequired,
  questaoIndex: PropTypes.number.isRequired,
  questaoAtual: PropTypes.shape({
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    answer: PropTypes.number.isRequired,
    alternatives: PropTypes.arrayOf(PropTypes.string.isRequired),
  }).isRequired,
};
