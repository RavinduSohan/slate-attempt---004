import React, { useState, useEffect } from 'react';
import { QuestionService } from './QuestionAPI.js';
import './QuestionPanel.css';

const QuestionPanel = () => {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  
  const userType = localStorage.getItem('userType');
  
  const canAnswer = ['Admin', 'Co-Main Station'].includes(userType);
  
  const isAdmin = userType === 'Admin';
  
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const fetchedQuestions = await QuestionService.getAllQuestions();
      setQuestions(fetchedQuestions);
      setError('');
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await QuestionService.postQuestion(title, description);
      setSuccess('Question submitted successfully!');
      setTitle('');
      setDescription('');
      setError('');
      fetchQuestions();
    } catch (err) {
      console.error('Error submitting question:', err);
      setError('Failed to submit question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewQuestion = async (questionId) => {
    try {
      const question = await QuestionService.getQuestionById(questionId);
      setSelectedQuestion(question);
      setError('');
    } catch (err) {
      console.error('Error fetching question details:', err);
      setError('Failed to load question details.');
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answer.trim()) {
      setError('Please enter an answer');
      return;
    }

    setLoading(true);
    try {
      await QuestionService.answerQuestion(selectedQuestion._id, answer);
      setSuccess('Answer submitted successfully!');
      setAnswer('');
      setError('');
      fetchQuestions();
      
      
      const updatedQuestion = await QuestionService.getQuestionById(selectedQuestion._id);
      setSelectedQuestion(updatedQuestion);
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError('Failed to submit answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseQuestion = async (questionId) => {
    setLoading(true);
    try {
      await QuestionService.closeQuestion(questionId);
      setSuccess('Question closed successfully!');
      fetchQuestions();
      
      
      if (selectedQuestion && selectedQuestion._id === questionId) {
        const updatedQuestion = await QuestionService.getQuestionById(questionId);
        setSelectedQuestion(updatedQuestion);
      }
    } catch (err) {
      console.error('Error closing question:', err);
      setError('Failed to close question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending': return 'badge bg-warning text-dark';
      case 'Answered': return 'badge bg-success';
      case 'Closed': return 'badge bg-secondary';
      default: return 'badge bg-primary';
    }
  };

  return (
    <div className="question-panel container mt-4 mb-5">
      <h2 className="text-center mb-4">Question & Answer Panel</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      
      {!isAdmin && (
        <div className="question-form">
          <h3>Ask a Question</h3>
          <form onSubmit={handleSubmitQuestion}>
            <div className="mb-3">
              <label htmlFor="questionTitle" className="form-label">Title</label>
              <input 
                type="text" 
                className="form-control" 
                id="questionTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter question title"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="questionDescription" className="form-label">Description</label>
              <textarea 
                className="form-control" 
                id="questionDescription" 
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter detailed description of your question"
                required
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Question'}
            </button>
          </form>
        </div>
      )}

      <div className="row">
        
        <div className={selectedQuestion ? "col-md-5" : "col-md-12"}>
          <div className="question-list">
            <h3>Your Questions</h3>
            {questions.length === 0 ? (
              <div className="no-questions">
                <p className="mb-0">No questions yet. Ask your first question above!</p>
              </div>
            ) : (
              questions.map(question => (
                <div key={question._id} className="card question-card mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="card-title">{question.title}</h5>
                      <span className={getStatusBadgeClass(question.status)}>
                        {question.status}
                      </span>
                    </div>
                    <p className="card-text text-muted">
                      {question.description.length > 100 
                        ? `${question.description.substring(0, 100)}...` 
                        : question.description}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        Posted: {new Date(question.createdAt).toLocaleString()}
                      </small>
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleViewQuestion(question._id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        
        {selectedQuestion && (
          <div className="col-md-7">
            <div className="card question-details">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="mb-0">{selectedQuestion.title}</h4>
                <span className={getStatusBadgeClass(selectedQuestion.status)}>
                  {selectedQuestion.status}
                </span>
              </div>
              <div className="card-body">
                <p className="card-text">{selectedQuestion.description}</p>
                <div className="text-muted mb-4">
                  <small>Posted: {new Date(selectedQuestion.createdAt).toLocaleString()}</small>
                </div>

                {selectedQuestion.answer && selectedQuestion.answer.text && (
                  <div className="question-answer">
                    <h5>Answer:</h5>
                    <p>{selectedQuestion.answer.text}</p>
                    <div className="text-muted">
                      <small>
                        Answered by: {selectedQuestion.answer.answeredBy.userType} on{' '}
                        {new Date(selectedQuestion.answer.answeredAt).toLocaleString()}
                      </small>
                    </div>
                  </div>
                )}

                {selectedQuestion.status === 'Pending' && canAnswer && (
                  <div className="answer-form">
                    <h5>Provide an Answer</h5>
                    <form onSubmit={handleSubmitAnswer}>
                      <div className="mb-3">
                        <textarea 
                          className="form-control" 
                          rows="4"
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          placeholder="Type your answer here"
                          required
                        ></textarea>
                      </div>
                      <button 
                        type="submit" 
                        className="btn btn-success" 
                        disabled={loading}
                      >
                        {loading ? 'Submitting...' : 'Submit Answer'}
                      </button>
                    </form>
                  </div>
                )}

                <div className="mt-4">
                  {selectedQuestion.status !== 'Closed' && (
                    <div className="action-buttons">
                      {(userType === 'Admin' || 
                       selectedQuestion.askedBy.userType === userType) && (
                        <button 
                          className="btn btn-outline-secondary"
                          onClick={() => handleCloseQuestion(selectedQuestion._id)}
                          disabled={loading}
                        >
                          Close Question
                        </button>
                      )}
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => setSelectedQuestion(null)}
                      >
                        Back to List
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionPanel;
