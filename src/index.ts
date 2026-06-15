const getRange = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

export type PaginationConfig = {
  total: number;
  perPage: number;
  currentPage: number;
  siblingCount?: number;
  boundaryCount?: number;
};

const isInvalid = (n: number) => Number.isNaN(n) || n < 0;

const generate = ({
  siblingCount = 1,
  boundaryCount = 1,
  ...config
}: PaginationConfig) => {
  if (
    isInvalid(config.perPage) ||
    config.perPage === 0 ||
    isInvalid(config.total) ||
    isInvalid(config.currentPage) ||
    config.currentPage === 0 ||
    isInvalid(siblingCount) ||
    isInvalid(boundaryCount)
  )
    return [1];

  const totalPages = Math.ceil(config.total / config.perPage);

  const startPages = getRange(1, Math.min(boundaryCount, totalPages));
  const endPages = getRange(
    Math.max(totalPages - boundaryCount + 1, boundaryCount + 1),
    totalPages,
  );

  const siblingsStart = Math.max(
    Math.min(
      config.currentPage - siblingCount,
      totalPages - boundaryCount - siblingCount * 2 - 1,
    ),
    boundaryCount + 2,
  );

  const siblingsEnd = Math.min(
    Math.max(
      config.currentPage + siblingCount,
      boundaryCount + siblingCount * 2 + 2,
    ),
    totalPages - boundaryCount - 1,
  );

  const schema = [
    ...startPages,
    ...(siblingsStart > boundaryCount + 2
      ? [0]
      : boundaryCount + 1 < totalPages - boundaryCount
        ? [boundaryCount + 1]
        : []),

    ...getRange(siblingsStart, siblingsEnd),

    ...(siblingsEnd < totalPages - boundaryCount - 1
      ? [0]
      : totalPages - boundaryCount > boundaryCount
        ? [totalPages - boundaryCount]
        : []),

    ...endPages,
  ];

  return schema;
};

export default generate;
