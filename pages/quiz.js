/* eslint-disable comma-dangle */
/* eslint-disable react/jsx-one-expression-per-line */
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
import AltertiveForm from '../src/components/AlternativeForm';

function QuestionWidget({
  onSubmit,
  questaoAtual,
  totalQuestoes,
  questaoIndex,
  setAlternativaSelecionada,
  isSubmitted,
  isCorrect,
  disableButton,
  setDisableButton,
  alternativeStatus,
  alternativaSelecionada,
}) {
  return (
    <Widget>
      <Widget.Header>
        {`Pergunta ${questaoIndex + 1} de ${totalQuestoes}`}
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
        <AltertiveForm
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          {questaoAtual.alternatives.map((alternativa, index) => {
            const isSelected = alternativaSelecionada === index;
            return (
              <Widget.Topic
                as="label"
                htmlFor={`alternative__${index}`}
                key={alternativa}
                data-selected={isSelected}
                data-status={isSubmitted && alternativeStatus}
              >
                <input
                  style={{ display: 'none' }}
                  id={`alternative__${index}`}
                  name={`questao__${questaoIndex}`}
                  type="radio"
                  key={alternativa}
                  onChange={() => {
                    setAlternativaSelecionada(index);
                    setDisableButton(false);
                  }}
                />
                {alternativa}
              </Widget.Topic>
            );
          })}
          <Button type="submit" disabled={disableButton}>
            CONFIRMAR
          </Button>
          {isSubmitted && isCorrect && <p>ACERTOU!!!</p>}
          {isSubmitted && !isCorrect && <p>ERROU!!!</p>}
        </AltertiveForm>
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
  const [acertos, setAcertos] = React.useState([]);
  const totalQuestoes = db.questions.length;
  const [questaoIndex, setQuestaoIndex] = React.useState(0);
  const questaoAtual = db.questions[questaoIndex];
  const [alternativaSelecionada, setAlternativaSelecionada] = React.useState(
    null
  );
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const isCorrect = alternativaSelecionada === questaoAtual.answer;
  const [disableButton, setDisableButton] = React.useState(true);
  const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';

  function addResult() {
    const resultado = isCorrect;
    setAcertos([...acertos, resultado]);
  }

  function handleSubmit() {
    const proximaQuestao = questaoIndex + 1;
    if (proximaQuestao < totalQuestoes) {
      setDisableButton(true);
      setIsSubmitted(true);
      setTimeout(() => {
        setQuestaoIndex(proximaQuestao);
        setIsSubmitted(false);
        setAlternativaSelecionada(null);
      }, 3 * 1000);
      addResult();
    } else {
      addResult();
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
            alternativaSelecionada={alternativaSelecionada}
            setAlternativaSelecionada={setAlternativaSelecionada}
            isCorrect={isCorrect}
            isSubmitted={isSubmitted}
            disableButton={disableButton}
            setDisableButton={setDisableButton}
            alternativeStatus={alternativeStatus}
          />
        )}

        {screenState === screenStates.RESULTADO && (
          <Widget>
            <Widget.Header>
              <h1>RESULTADO</h1>
            </Widget.Header>
            <Widget.Content acertos={acertos}>
              {`Você acertou ${
                acertos.filter((x) => x).length
              } de ${totalQuestoes} perguntas! PARABÉNS`}
              <ul>
                {acertos.map((acerto, index) => (
                  <li key={`resutl__${index + 1}`}>
                    #{index + 1} Questão:
                    {acerto === true ? 'Acertou' : 'Errou'}
                  </li>
                ))}
              </ul>
            </Widget.Content>
          </Widget>
        )}
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/pedroarch" />
    </QuizBackground>
  );
}

QuestionWidget.propTypes = {
  alternativeStatus: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isCorrect: PropTypes.bool.isRequired,
  disableButton: PropTypes.bool.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  setAlternativaSelecionada: PropTypes.func.isRequired,
  setDisableButton: PropTypes.func.isRequired,
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
