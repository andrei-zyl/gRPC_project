// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var protos_sum_pb = require('../protos/sum_pb.js');

function serialize_sum_AverageRequest(arg) {
  if (!(arg instanceof protos_sum_pb.AverageRequest)) {
    throw new Error('Expected argument of type sum.AverageRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sum_AverageRequest(buffer_arg) {
  return protos_sum_pb.AverageRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sum_AverageResponse(arg) {
  if (!(arg instanceof protos_sum_pb.AverageResponse)) {
    throw new Error('Expected argument of type sum.AverageResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sum_AverageResponse(buffer_arg) {
  return protos_sum_pb.AverageResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sum_MaxNumberRequest(arg) {
  if (!(arg instanceof protos_sum_pb.MaxNumberRequest)) {
    throw new Error('Expected argument of type sum.MaxNumberRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sum_MaxNumberRequest(buffer_arg) {
  return protos_sum_pb.MaxNumberRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sum_MaxNumberResponse(arg) {
  if (!(arg instanceof protos_sum_pb.MaxNumberResponse)) {
    throw new Error('Expected argument of type sum.MaxNumberResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sum_MaxNumberResponse(buffer_arg) {
  return protos_sum_pb.MaxNumberResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sum_SquareRootRequest(arg) {
  if (!(arg instanceof protos_sum_pb.SquareRootRequest)) {
    throw new Error('Expected argument of type sum.SquareRootRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sum_SquareRootRequest(buffer_arg) {
  return protos_sum_pb.SquareRootRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sum_SquareRootResponse(arg) {
  if (!(arg instanceof protos_sum_pb.SquareRootResponse)) {
    throw new Error('Expected argument of type sum.SquareRootResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sum_SquareRootResponse(buffer_arg) {
  return protos_sum_pb.SquareRootResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sum_SumManyTimesRequest(arg) {
  if (!(arg instanceof protos_sum_pb.SumManyTimesRequest)) {
    throw new Error('Expected argument of type sum.SumManyTimesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sum_SumManyTimesRequest(buffer_arg) {
  return protos_sum_pb.SumManyTimesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sum_SumManyTimesResponse(arg) {
  if (!(arg instanceof protos_sum_pb.SumManyTimesResponse)) {
    throw new Error('Expected argument of type sum.SumManyTimesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sum_SumManyTimesResponse(buffer_arg) {
  return protos_sum_pb.SumManyTimesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sum_SumRequest(arg) {
  if (!(arg instanceof protos_sum_pb.SumRequest)) {
    throw new Error('Expected argument of type sum.SumRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sum_SumRequest(buffer_arg) {
  return protos_sum_pb.SumRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sum_SumResponse(arg) {
  if (!(arg instanceof protos_sum_pb.SumResponse)) {
    throw new Error('Expected argument of type sum.SumResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sum_SumResponse(buffer_arg) {
  return protos_sum_pb.SumResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var SumServiceService = exports.SumServiceService = {
  sum: {
    path: '/sum.SumService/Sum',
    requestStream: false,
    responseStream: false,
    requestType: protos_sum_pb.SumRequest,
    responseType: protos_sum_pb.SumResponse,
    requestSerialize: serialize_sum_SumRequest,
    requestDeserialize: deserialize_sum_SumRequest,
    responseSerialize: serialize_sum_SumResponse,
    responseDeserialize: deserialize_sum_SumResponse,
  },
  sumManyTimes: {
    path: '/sum.SumService/SumManyTimes',
    requestStream: false,
    responseStream: true,
    requestType: protos_sum_pb.SumManyTimesRequest,
    responseType: protos_sum_pb.SumManyTimesResponse,
    requestSerialize: serialize_sum_SumManyTimesRequest,
    requestDeserialize: deserialize_sum_SumManyTimesRequest,
    responseSerialize: serialize_sum_SumManyTimesResponse,
    responseDeserialize: deserialize_sum_SumManyTimesResponse,
  },
  average: {
    path: '/sum.SumService/Average',
    requestStream: true,
    responseStream: false,
    requestType: protos_sum_pb.AverageRequest,
    responseType: protos_sum_pb.AverageResponse,
    requestSerialize: serialize_sum_AverageRequest,
    requestDeserialize: deserialize_sum_AverageRequest,
    responseSerialize: serialize_sum_AverageResponse,
    responseDeserialize: deserialize_sum_AverageResponse,
  },
  maxNumber: {
    path: '/sum.SumService/MaxNumber',
    requestStream: true,
    responseStream: true,
    requestType: protos_sum_pb.MaxNumberRequest,
    responseType: protos_sum_pb.MaxNumberResponse,
    requestSerialize: serialize_sum_MaxNumberRequest,
    requestDeserialize: deserialize_sum_MaxNumberRequest,
    responseSerialize: serialize_sum_MaxNumberResponse,
    responseDeserialize: deserialize_sum_MaxNumberResponse,
  },
  squareRoot: {
    path: '/sum.SumService/SquareRoot',
    requestStream: false,
    responseStream: false,
    requestType: protos_sum_pb.SquareRootRequest,
    responseType: protos_sum_pb.SquareRootResponse,
    requestSerialize: serialize_sum_SquareRootRequest,
    requestDeserialize: deserialize_sum_SquareRootRequest,
    responseSerialize: serialize_sum_SquareRootResponse,
    responseDeserialize: deserialize_sum_SquareRootResponse,
  },
};

exports.SumServiceClient = grpc.makeGenericClientConstructor(SumServiceService);
