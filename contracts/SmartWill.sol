// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, eaddress, externalEaddress} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Smart Will Contract with 3-Address Encryption
/// @notice A secure will storage system using 3-layer address encryption with FHEVM
contract SmartWill is SepoliaConfig {
    struct Will {
        string encryptedContent; // The final encrypted content (C)
        eaddress address1; // First encryption address (encrypted)
        eaddress address2; // Second encryption address (encrypted)
        eaddress address3; // Third encryption address (encrypted)
        address owner; // Owner of the will
        uint256 timestamp; // Creation timestamp
        bool exists; // Whether the will exists
    }

    mapping(address => Will) public wills;
    mapping(address => bool) public hasWill;

    uint256 public totalWills;

    event WillCreated(address indexed owner, uint256 timestamp);
    event WillUpdated(address indexed owner, uint256 timestamp);

    /// @notice Creates a new will with 3-address encryption
    /// @param encryptedContent The final encrypted will content (C)
    /// @param addr1 First encrypted address
    /// @param proof1 Proof for first address
    /// @param addr2 Second encrypted address
    /// @param proof2 Proof for second address
    /// @param addr3 Third encrypted address
    /// @param proof3 Proof for third address
    function createWill(
        string calldata encryptedContent,
        externalEaddress addr1,
        bytes calldata proof1,
        externalEaddress addr2,
        bytes calldata proof2,
        externalEaddress addr3,
        bytes calldata proof3
    ) external {
        require(bytes(encryptedContent).length > 0, "Will content cannot be empty");

        eaddress encryptedAddr1 = FHE.fromExternal(addr1, proof1);
        eaddress encryptedAddr2 = FHE.fromExternal(addr2, proof2);
        eaddress encryptedAddr3 = FHE.fromExternal(addr3, proof3);

        wills[msg.sender] = Will({
            encryptedContent: encryptedContent,
            address1: encryptedAddr1,
            address2: encryptedAddr2,
            address3: encryptedAddr3,
            owner: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        if (!hasWill[msg.sender]) {
            hasWill[msg.sender] = true;
            totalWills++;
            emit WillCreated(msg.sender, block.timestamp);
        } else {
            emit WillUpdated(msg.sender, block.timestamp);
        }

        // Allow the owner to access their encrypted addresses
        FHE.allow(encryptedAddr1, msg.sender);
        FHE.allow(encryptedAddr2, msg.sender);
        FHE.allow(encryptedAddr3, msg.sender);
    }

    /// @notice Updates an existing will
    /// @param encryptedContent The new encrypted will content
    /// @param addr1 New first encrypted address
    /// @param proof1 Proof for first address
    /// @param addr2 New second encrypted address
    /// @param proof2 Proof for second address
    /// @param addr3 New third encrypted address
    /// @param proof3 Proof for third address
    function updateWill(
        string calldata encryptedContent,
        externalEaddress addr1,
        bytes calldata proof1,
        externalEaddress addr2,
        bytes calldata proof2,
        externalEaddress addr3,
        bytes calldata proof3
    ) external {
        require(hasWill[msg.sender], "No existing will found");
        require(bytes(encryptedContent).length > 0, "Will content cannot be empty");

        eaddress encryptedAddr1 = FHE.fromExternal(addr1, proof1);
        eaddress encryptedAddr2 = FHE.fromExternal(addr2, proof2);
        eaddress encryptedAddr3 = FHE.fromExternal(addr3, proof3);

        wills[msg.sender].encryptedContent = encryptedContent;
        wills[msg.sender].address1 = encryptedAddr1;
        wills[msg.sender].address2 = encryptedAddr2;
        wills[msg.sender].address3 = encryptedAddr3;
        wills[msg.sender].timestamp = block.timestamp;

        // Allow the owner to access their encrypted addresses
        FHE.allow(encryptedAddr1, msg.sender);
        FHE.allow(encryptedAddr2, msg.sender);
        FHE.allow(encryptedAddr3, msg.sender);

        emit WillUpdated(msg.sender, block.timestamp);
    }

    /// @notice Gets the encrypted will content for the caller
    /// @return The encrypted will content
    function getWillContent() external view returns (string memory) {
        require(hasWill[msg.sender], "No will found");
        return wills[msg.sender].encryptedContent;
    }

    /// @notice Gets the first encrypted address for the caller
    /// @return The first encrypted address
    function getAddress1() external view returns (eaddress) {
        require(hasWill[msg.sender], "No will found");
        return wills[msg.sender].address1;
    }

    /// @notice Gets the second encrypted address for the caller
    /// @return The second encrypted address
    function getAddress2() external view returns (eaddress) {
        require(hasWill[msg.sender], "No will found");
        return wills[msg.sender].address2;
    }

    /// @notice Gets the third encrypted address for the caller
    /// @return The third encrypted address
    function getAddress3() external view returns (eaddress) {
        require(hasWill[msg.sender], "No will found");
        return wills[msg.sender].address3;
    }

    /// @notice Gets will metadata for the caller
    /// @return owner The will owner
    /// @return timestamp Creation/update timestamp
    /// @return exists Whether the will exists
    function getWillMetadata() external view returns (address owner, uint256 timestamp, bool exists) {
        Will memory will = wills[msg.sender];
        return (will.owner, will.timestamp, will.exists);
    }

    /// @notice Checks if an address has a will
    /// @param account The address to check
    /// @return Whether the address has a will
    function hasWillFor(address account) external view returns (bool) {
        return hasWill[account];
    }

    /// @notice Gets the total number of wills created
    /// @return Total number of wills
    function getTotalWills() external view returns (uint256) {
        return totalWills;
    }

    /// @notice Deletes the caller's will
    function deleteWill() external {
        require(hasWill[msg.sender], "No will found");

        delete wills[msg.sender];
        hasWill[msg.sender] = false;
        totalWills--;
    }
}