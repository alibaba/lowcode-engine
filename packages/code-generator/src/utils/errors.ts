/**
 * 获取错误信息
 */
export function getErrorMessage(error: unknown): string | null {
  if (!error) {
    return null;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (typeof error === 'object' && error !== null) {
    return (
      getErrorMessage((error as { message: string }).message) ||
      getErrorMessage((error as { errorMessage: string }).errorMessage) ||
      getErrorMessage((error as { detail: string }).detail)
    );
  }

  return null;
}
