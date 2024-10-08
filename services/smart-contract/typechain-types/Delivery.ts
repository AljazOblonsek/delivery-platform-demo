/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "./common";

export declare namespace Delivery {
  export type PackageDtoStruct = {
    trackNumber: string;
    encryptedInformation: string;
  };

  export type PackageDtoStructOutput = [
    trackNumber: string,
    encryptedInformation: string
  ] & { trackNumber: string; encryptedInformation: string };

  export type PackageStruct = {
    trackNumber: string;
    deliveryCompanyAddress: AddressLike;
    encryptedInformation: string[];
  };

  export type PackageStructOutput = [
    trackNumber: string,
    deliveryCompanyAddress: string,
    encryptedInformation: string[]
  ] & {
    trackNumber: string;
    deliveryCompanyAddress: string;
    encryptedInformation: string[];
  };
}

export interface DeliveryInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "addDeliveryCompanyAddress"
      | "addPackage"
      | "deliveryCompanyAddresses"
      | "getPackage"
      | "owner"
      | "packages"
      | "updatePackage"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addDeliveryCompanyAddress",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "addPackage",
    values: [Delivery.PackageDtoStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "deliveryCompanyAddresses",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "getPackage", values: [string]): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "packages",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "updatePackage",
    values: [Delivery.PackageDtoStruct]
  ): string;

  decodeFunctionResult(
    functionFragment: "addDeliveryCompanyAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "addPackage", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "deliveryCompanyAddresses",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getPackage", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "packages", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "updatePackage",
    data: BytesLike
  ): Result;
}

export interface Delivery extends BaseContract {
  connect(runner?: ContractRunner | null): Delivery;
  waitForDeployment(): Promise<this>;

  interface: DeliveryInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  addDeliveryCompanyAddress: TypedContractMethod<
    [_address: AddressLike],
    [void],
    "nonpayable"
  >;

  addPackage: TypedContractMethod<
    [packageDto: Delivery.PackageDtoStruct],
    [void],
    "nonpayable"
  >;

  deliveryCompanyAddresses: TypedContractMethod<
    [arg0: BigNumberish],
    [string],
    "view"
  >;

  getPackage: TypedContractMethod<
    [trackNumber: string],
    [Delivery.PackageStructOutput],
    "view"
  >;

  owner: TypedContractMethod<[], [string], "view">;

  packages: TypedContractMethod<
    [arg0: BigNumberish],
    [
      [string, string] & { trackNumber: string; deliveryCompanyAddress: string }
    ],
    "view"
  >;

  updatePackage: TypedContractMethod<
    [packageDto: Delivery.PackageDtoStruct],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "addDeliveryCompanyAddress"
  ): TypedContractMethod<[_address: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "addPackage"
  ): TypedContractMethod<
    [packageDto: Delivery.PackageDtoStruct],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "deliveryCompanyAddresses"
  ): TypedContractMethod<[arg0: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "getPackage"
  ): TypedContractMethod<
    [trackNumber: string],
    [Delivery.PackageStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "packages"
  ): TypedContractMethod<
    [arg0: BigNumberish],
    [
      [string, string] & { trackNumber: string; deliveryCompanyAddress: string }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "updatePackage"
  ): TypedContractMethod<
    [packageDto: Delivery.PackageDtoStruct],
    [void],
    "nonpayable"
  >;

  filters: {};
}
