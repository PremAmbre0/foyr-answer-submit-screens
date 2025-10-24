import { routes } from './base/apiRoutes';
import {
  // deleteAPIResponse,
  getAPIResponse,
  postAPIResponse,
  patchAPIResponse,
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

export const addAnswer = async (data) => {
  return postAPIResponse(routes.addAnswer, data).catch((e) => {
    console.error('Error adding answer:', e);
    throw e;
  });
};

export const lockQuestionnaire = async (questionnaireId) => {
  return patchAPIResponse(routes.lockQuestionnaire(questionnaireId), {}).catch((e) => {
    console.error('Error locking questionnaire:', e);
    throw e;
  });
};

export const requestUnlock = async (questionnaireId) => {
  return postAPIResponse(routes.requestUnlock(questionnaireId), {}).catch((e) => {
    console.error('Error requesting unlock:', e);
    throw e;
  });
};

export const requestEditAccess = async (questionnaireId) => {
  return postAPIResponse(routes.requestEditAccess(questionnaireId), {}).catch((e) => {
    console.error('Error requesting edit access:', e);
    return handle401(e);
  });
};

export const uploadToS3 = async (file) => {
  // Mock S3 upload - returns lorem picsum URL after random 1-3 seconds
  return new Promise((resolve) => {
    const randomDelay = Math.floor(Math.random() * 2000) + 1000; // 1000-3000ms
    
    setTimeout(() => {
      const randomId = Math.floor(Math.random() * 1000);
      const mockUrl = `https://picsum.photos/400/300?random=${randomId}`;
      
      console.log('[MOCK S3] File uploaded:', file.name, '-> URL:', mockUrl, `(${randomDelay}ms)`);
      
      resolve({
        data: {
          success: true,
          data: {
            url: mockUrl,
          },
        },
      });
    }, randomDelay);
  });
  
  // Real implementation (commented out for now)
  // const formData = new FormData();
  // formData.append('file', file);
  // 
  // return postAPIResponse(routes.uploadToS3, formData, {
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //   },
  // }).catch((e) => {
  //   console.error('Error uploading to S3:', e);
  //   throw e;
  // });
};
