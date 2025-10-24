export const routes = {
  getLoginURL: 'login/url',
  login: 'login',
  getQuestionnaireById: (id) => `questionnaire/${id}`,
  addAnswer: (questionnaireId) => `questionnaire/${questionnaireId}/answer`,
  requestEditAccess: (questionnaireId) => `questionnaire/${questionnaireId}/request-edit`,
  uploadToS3: 'upload/s3',
};
