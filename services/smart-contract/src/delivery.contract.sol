// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Delivery {
  struct PackageDto {
    string trackNumber;
    string encryptedInformation;
  }

  struct Package {
    string trackNumber;
    address deliveryCompanyAddress;
    string[] encryptedInformation;
  }

  address public owner;
  address[] public deliveryCompanyAddresses;
  Package[] public packages;

  constructor() {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, 'Not owner');
    _;
  }

  modifier onlyDeliveryCompany(address _address) {
    bool addressFoundInArray = false;

    for (uint i = 0; i < deliveryCompanyAddresses.length; i++) {
      if (deliveryCompanyAddresses[i] == msg.sender) {
        addressFoundInArray = true;
      }
    }

    if (!addressFoundInArray) {
      revert('Not a delivery company');
    }

    _;
  }

  function addDeliveryCompanyAddress(address _address) public onlyOwner {
    bool addressFoundInArray = false;
    for (uint i = 0; i < deliveryCompanyAddresses.length; i++) {
      if (deliveryCompanyAddresses[i] == _address) {
        addressFoundInArray = true;
      }
    }

    if (addressFoundInArray) {
      revert('Address is already in the list');
    }

    deliveryCompanyAddresses.push(_address);
  }

  function getPackage(string memory trackNumber) public view returns (Package memory) {
    // Check if package with trackNumber exists
    bool trackNumberFoundInArray = false;
    uint256 packageIndex = 0;

    for (uint i = 0; i < packages.length; i++) {
      if (
        keccak256(abi.encodePacked(packages[i].trackNumber)) ==
        keccak256(abi.encodePacked(trackNumber))
      ) {
        trackNumberFoundInArray = true;
        packageIndex = i;
      }
    }

    if (!trackNumberFoundInArray) {
      revert('Package with given track number not found');
    }

    return packages[packageIndex];
  }

  function addPackage(PackageDto memory packageDto) public onlyDeliveryCompany(msg.sender) {
    // Check if package with same trackNumber already exists
    bool trackNumberFoundInArray = false;

    for (uint i = 0; i < packages.length; i++) {
      if (
        keccak256(abi.encodePacked(packages[i].trackNumber)) ==
        keccak256(abi.encodePacked(packageDto.trackNumber))
      ) {
        trackNumberFoundInArray = true;
      }
    }

    if (trackNumberFoundInArray) {
      revert('Package with given track number already exists');
    }

    string[] memory encryptedInformation = new string[](1);
    encryptedInformation[0] = packageDto.encryptedInformation;

    packages.push(Package(packageDto.trackNumber, msg.sender, encryptedInformation));
  }

  function updatePackage(PackageDto memory packageDto) public onlyDeliveryCompany(msg.sender) {
    // Check if package with trackNumber exists
    bool trackNumberFoundInArray = false;
    uint256 packageIndex = 0;

    for (uint i = 0; i < packages.length; i++) {
      if (
        keccak256(abi.encodePacked(packages[i].trackNumber)) ==
        keccak256(abi.encodePacked(packageDto.trackNumber))
      ) {
        trackNumberFoundInArray = true;
        packageIndex = i;
      }
    }

    if (!trackNumberFoundInArray) {
      revert('Package with given track number not found');
    }

    if (packages[packageIndex].deliveryCompanyAddress != msg.sender) {
      revert('You are not allowed to update this package');
    }

    uint256 encryptedInformationLength = packages[packageIndex].encryptedInformation.length;

    string[] memory newEncryptedInformation = new string[](encryptedInformationLength + 1);

    for (uint i = 0; i < encryptedInformationLength; i++) {
      newEncryptedInformation[i] = packages[packageIndex].encryptedInformation[i];
    }

    newEncryptedInformation[encryptedInformationLength] = packageDto.encryptedInformation;

    packages[packageIndex].encryptedInformation = newEncryptedInformation;
  }
}
