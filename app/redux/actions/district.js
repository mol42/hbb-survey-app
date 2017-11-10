import {
  SET_SELECTED_DISTRICT_OPTIONS,
  GET_DISTRICT_LIST_REQUEST,
  GET_DISTRICT_LIST_SUCCESS,
  GET_NEIGHBOURHOOD_OF_DISTRICT_REQUEST,
  GET_NEIGHBOURHOOD_OF_DISTRICT_SUCCESS
} from "./actionTypes";

export function getDistrictList() {
    return {
      type : GET_DISTRICT_LIST_REQUEST
    }
}
  
export function getDistrictListSuccess(districtList) {
  return {
    type : GET_DISTRICT_LIST_SUCCESS,
    districtList
  }
}
  
export function getNeighbourHoodOfDistrict(districtId) {
  return {
    type : GET_NEIGHBOURHOOD_OF_DISTRICT_REQUEST,
    districtId
  }
}

export function getNeighbourHoodOfDistrictSuccess(neighbourHoodList) {
  return {
    type : GET_NEIGHBOURHOOD_OF_DISTRICT_SUCCESS,
    neighbourHoodList
  }
}