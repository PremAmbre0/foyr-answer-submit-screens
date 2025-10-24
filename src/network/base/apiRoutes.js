export const routes = {
  getLoginURL: 'login/url',
  login: 'login',
  getQuestionnaireById: (id) => `questionnaire/${id}`,
  addAnswer: 'answers/add',
  lockQuestionnaire: (questionnaireId) => `questionnaire/${questionnaireId}/lock`,
  requestUnlock: (questionnaireId) => `answers/request-unlock/${questionnaireId}`,
  uploadToS3: 'upload/s3',
};
