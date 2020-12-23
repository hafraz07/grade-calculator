import React from 'react';
import PropTypes from 'prop-types';
import './App.css';

class Widget extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        sliderValues: Array(2).fill(50),
        scoresAttained: Array(2).fill(null),
        totals: Array(2).fill(null),
        weightedScores: [],
        actualTotal: null,
        achievedTotal: null,
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleRemove = this.handleRemove.bind(this);
      this.handleAdd = this.handleAdd.bind(this);
      this.handleScoresAttained = this.handleScoresAttained.bind(this);
      this.handleTotalScores = this.handleTotalScores.bind(this);
      this.calculateGrade = this.calculateGrade.bind(this);
    }

    handleChange(e, i) {
      e.preventDefault();
      const sliderValues = this.state.sliderValues.slice();
      sliderValues[i] = e.target.value;
      this.setState({sliderValues: sliderValues});
    }

    handleRemove() {
      const sliderValues = this.state.sliderValues.slice();
      const scoresAttained = this.state.scoresAttained.slice();
      const totals = this.state.totals.slice();
      sliderValues.pop();
      scoresAttained.pop();
      totals.pop();
      this.setState({sliderValues: sliderValues,
                     scoresAttained: scoresAttained,
                     totals: totals});
    }

    handleAdd() {
      const sliderValues = this.state.sliderValues.slice();
      const scoresAttained = this.state.scoresAttained.slice();
      const totals = this.state.totals.slice();
      sliderValues.push(50);
      scoresAttained.push(null);
      totals.push(null);
      this.setState({sliderValues: sliderValues});
    }

    handleScoresAttained(e, i) {
      e.preventDefault();
      const scoresAttained = this.state.scoresAttained.slice();
      scoresAttained[i] = e.target.value;
      this.setState({scoresAttained: scoresAttained});
    }

    handleTotalScores(e, i) {
      e.preventDefault();
      const totals = this.state.totals.slice();
      totals[i] = e.target.value;
      this.setState({totals: totals});
    }

    renderRemove() {
      /* Show the remove button only if there is more than 1 component. */
      const oneRemaining = this.state.sliderValues.length === 1 ? true : false
      if (!oneRemaining)
        return <button className="remove" onClick={this.handleRemove}>Remove</button>
    }

    renderGrades() {
      const {weightedScores, actualTotal, achievedTotal} = this.state;
      const renderedWeights = weightedScores.map((item, index) => {
        if (!Number.isNaN(item)) {
          item = item.toFixed(2);
          return <div> Component {index + 1} ({item}%) </div>
        }
      });
      const finalScore = achievedTotal && !Number.isNaN(achievedTotal) ? <div>{achievedTotal}%</div> : null

      return (
        <div>
          {renderedWeights}
          {finalScore}
        </div>
      );
    }

    calculateGrade() {
      const {sliderValues, scoresAttained, totals} = this.state;
      let weightedScores = []
      for (let i = 0; i < sliderValues.length; ++i) {
        const temp = (Number(sliderValues[i])) * (Number(scoresAttained[i]) / Number(totals[i]));
        weightedScores.push(temp);
      }
      let actualTotal = 0;
      let achievedTotal = 0;
      totals.forEach((item) => (actualTotal += Number(item)));
      weightedScores.forEach((item) => (achievedTotal += Number(item)));
      this.setState({weightedScores: weightedScores,
                     actualTotal: actualTotal,
                     achievedTotal: achievedTotal,
                   });
    }

    render() {
      const gradeComponents = this.state.sliderValues.map((value, i) => (
        <GradeComponent
          number={i + 1}
          sliderValue={value}
          handleScoresAttained={this.handleScoresAttained}
          handleTotalScores={this.handleTotalScores}
          onChange={this.handleChange}/>
      ));
      return (
        <div className="App">
          <header className="App-header">

            <h1>Grade Calculator</h1>
            <p>
            Enter the weight (percentage) and score of each component of your course to
            calculate your weighted grade.
            </p>
            {gradeComponents}
            {this.renderRemove()}
            <br/>
            <button className="add" onClick={this.handleAdd}>Add Component</button>
            <button className="add" onClick={this.calculateGrade}>Calculate Weighted Score</button>
            {this.renderGrades()}
          </header>
        </div>
      );
    }
}

function GradeComponent(props) {
  return (
    <div>
    <form>
      <label>
        Component {props.number}&nbsp;
        <input type="number" min="0" onChange={(e) => props.handleScoresAttained(e, props.number - 1)}
          placeholder="Score attained"/>
        <input type="number" min="0" onChange={(e) => props.handleTotalScores(e, props.number - 1)}
          placeholder="Total"/><br/>
        <label>
          Weight&nbsp;
          <input type="range" min="0" max="100" step="1" onChange={(e) => props.onChange(e, props.number - 1)}/>
          &nbsp;{props.sliderValue}
        </label>
      </label><br/>
    </form>
    </div>
  );
}

GradeComponent.propTypes = {
  handleChange: PropTypes.func.isRequired,
};

export default Widget;
export {GradeComponent};
