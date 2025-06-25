import { RequestContext } from 'nestjs-request-context';
import { DeviceContextInterface } from '../constants/context.constants';
import { UserProfileContextInterface } from 'src/common/constants/context.constants copy';

export const getDeviceContext = (): DeviceContextInterface => {
  return RequestContext?.currentContext?.req['device_context'] as DeviceContextInterface;
};

export const getRequestIdContext = (): string => {
  return RequestContext?.currentContext?.req['requestId'] as string;
};

export const getUserContext = (): UserProfileContextInterface => {
  return RequestContext?.currentContext?.req['user_context'] as UserProfileContextInterface;
};

export const setUserContent = (user: UserProfileContextInterface): void => {
  RequestContext.currentContext.req['user_context'] = user;
};
