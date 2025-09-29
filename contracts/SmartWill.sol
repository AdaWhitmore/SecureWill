// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, eaddress, externalEaddress} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title SmartWill - Encrypted will registry using Zama FHEVM
/// @notice Stores a user-provided encrypted will string and the three addresses used to encrypt it (as encrypted eaddress values)
/// @dev All view functions take an explicit user parameter; they MUST NOT rely on msg.sender
contract SmartWill is SepoliaConfig {
    struct WillRecord {
        // Encrypted will content (client-side reversible algorithm using three addresses)
        string encryptedWill;
        // Three encrypted addresses (encrypted with Zama FHE)
        eaddress addr1;
        eaddress addr2;
        eaddress addr3;
        // Metadata
        uint256 timestamp;
        address owner;
    }

    /// @dev mapping of user => will record
    mapping(address => WillRecord) private _records;

    event WillSubmitted(address indexed user, uint256 timestamp);

    /// @notice Submit or replace a will for the caller
    /// @param encryptedWill The client-side encrypted string C derived from the three addresses
    /// @param extAddr1 Encrypted handle for address #1
    /// @param extAddr2 Encrypted handle for address #2
    /// @param extAddr3 Encrypted handle for address #3
    /// @param inputProof Zama input proof covering all three handles
    function submitWill(
        string calldata encryptedWill,
        externalEaddress extAddr1,
        externalEaddress extAddr2,
        externalEaddress extAddr3,
        bytes calldata inputProof
    ) external {
        // Convert the external encrypted handles to encrypted eaddress values
        eaddress a1 = FHE.fromExternal(extAddr1, inputProof);
        eaddress a2 = FHE.fromExternal(extAddr2, inputProof);
        eaddress a3 = FHE.fromExternal(extAddr3, inputProof);

        // Allow contract and user to access encrypted addresses (for future decrypt requests)
        FHE.allowThis(a1);
        FHE.allowThis(a2);
        FHE.allowThis(a3);
        FHE.allow(a1, msg.sender);
        FHE.allow(a2, msg.sender);
        FHE.allow(a3, msg.sender);

        _records[msg.sender] = WillRecord({
            encryptedWill: encryptedWill,
            addr1: a1,
            addr2: a2,
            addr3: a3,
            timestamp: block.timestamp,
            owner: msg.sender
        });

        emit WillSubmitted(msg.sender, block.timestamp);
    }

    /// @notice Check whether a user has a will stored
    /// @param user The user account to check
    function hasWill(address user) external view returns (bool) {
        return bytes(_records[user].encryptedWill).length != 0;
    }

    /// @notice Get the encrypted will string for a user
    /// @param user The user account
    function getEncryptedWill(address user) external view returns (string memory) {
        return _records[user].encryptedWill;
    }

    /// @notice Get the three encrypted addresses (Zama eaddress) for a user
    /// @param user The user account
    /// @return a1 Encrypted address #1
    /// @return a2 Encrypted address #2
    /// @return a3 Encrypted address #3
    function getEncryptedAddresses(address user) external view returns (eaddress a1, eaddress a2, eaddress a3) {
        WillRecord storage r = _records[user];
        return (r.addr1, r.addr2, r.addr3);
    }

    /// @notice Get metadata for a user's will
    /// @param user The user account
    /// @return timestamp The block timestamp of last submission
    /// @return owner The owner address that submitted
    function getWillMeta(address user) external view returns (uint256 timestamp, address owner) {
        WillRecord storage r = _records[user];
        return (r.timestamp, r.owner);
    }
}

