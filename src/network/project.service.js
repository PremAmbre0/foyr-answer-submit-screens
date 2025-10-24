import { routes } from './base/apiRoutes';
import {
  // deleteAPIResponse,
  getAPIResponse,
  postAPIResponse,
  // putAPIResponse,
} from './base/api';
// import queryString from 'query-string';

const handle401 = (e) => {
  if (e.response && e.response.status === 401) {
    return false;
  }
};

export const fetchLoginRedirectURL = async () => {
  // queryString.stringify(data); -> Can use queryString like this by passing it an object of params
  return getAPIResponse(routes.getLoginURL).catch((e) => {
    return handle401(e);
  });
};

export const login = async (data) => {
  return postAPIResponse(routes.login, data).catch((e) => {
    return handle401(e);
  });
};

export const fetchQuestionnaireById = async (questionnaireId) => {
  return getAPIResponse(routes.getQuestionnaireById(questionnaireId)).catch((e) => {
    console.error('Error fetching questionnaire:', e);
    return handle401(e);
  });
};

export const addAnswer = async (questionnaireId, data) => {
  return postAPIResponse(routes.addAnswer(questionnaireId), data).catch((e) => {
    console.error('Error adding answer:', e);
    return handle401(e);
  });
};

export const requestEditAccess = async (questionnaireId) => {
  return postAPIResponse(routes.requestEditAccess(questionnaireId), {}).catch((e) => {
    console.error('Error requesting edit access:', e);
    return handle401(e);
  });
};
