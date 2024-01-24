import PropTypes from "prop-types";

export const EntitiesListResponseModel = {
  content: [],
  pageable: {
    sort: {
      empty: false,
      unsorted: false,
      sorted: true,
    },
    offset: 0,
    pageSize: 10,
    pageNumber: 0,
    paged: true,
    unpaged: false,
  },
  totalPages: 0,
  totalElements: 0,
  last: true,
  size: 10,
  number: 0,
  sort: {
    empty: false,
    unsorted: false,
    sorted: true,
  },
  first: true,
  numberOfElements: 0,
  empty: true,
};

export const EntitiesListResponseModelShape = PropTypes.shape({
  content: PropTypes.array,
  pageable: PropTypes.shape({
    sort: PropTypes.shape({
      empty: PropTypes.bool,
      unsorted: PropTypes.bool,
      sorted: PropTypes.bool,
    }),
    offset: PropTypes.number,
    pageSize: PropTypes.number,
    pageNumber: PropTypes.number,
    paged: PropTypes.bool,
    unpaged: PropTypes.bool,
  }),
  totalPages: PropTypes.number,
  totalElements: PropTypes.number,
  last: PropTypes.bool,
  size: PropTypes.number,
  number: PropTypes.number,
  sort: PropTypes.shape({
    empty: PropTypes.bool,
    unsorted: PropTypes.bool,
    sorted: PropTypes.bool,
  }),
  first: PropTypes.bool,
  numberOfElements: PropTypes.number,
  empty: PropTypes.bool,
});
