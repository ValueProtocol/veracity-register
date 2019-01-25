pragma solidity ^0.5.0;

import "./OperatorRole.sol";

contract VeracityRegister is OperatorRole {

    uint256 count = 0;
    mapping(uint256 => Passport) things;
    mapping(uint256 => uint256) index;

    struct Passport {
        uint256 updated;
        bytes32 owner;
        bytes32 fingerprints;
        bytes32 information;
        bytes32 properties;
        bytes32 manufacturingInformation;
        bytes32 lifecycleInformation;
    }

    function create(
        uint256 id,
        bytes32 owner,
        bytes32 fingerprints,
        bytes32 information,
        bytes32 properties,
        bytes32 manufacturingInformation,
        bytes32 lifecycleInformation
    ) public onlyOperator returns (uint256) {
        require(things[id].updated == 0, "ID already exists");
        Passport memory pass = Passport(
            now,
            owner,
            fingerprints,
            information,
            properties,
            manufacturingInformation,
            lifecycleInformation
        );
        things[id] = pass;
        index[count++] = id;
        emit Created(id);
    }

    function update(
        uint256 id,
        bytes32 owner,
        bytes32 fingerprints,
        bytes32 information,
        bytes32 properties,
        bytes32 manufacturingInformation,
        bytes32 lifecycleInformation
    ) public onlyOperator {
        bool change;
        Passport storage pass = things[id];
        if (pass.owner != owner) {
            emit OwnerChanged(id, pass.owner, owner);
            pass.owner = owner;
            change = true;
        }
        if (pass.fingerprints != fingerprints) {
            emit FingerprintsChanged(id, pass.fingerprints, fingerprints);
            pass.fingerprints = fingerprints;
            change = true;
        }
        if (pass.information != information) {
            emit InformationChanged(id, pass.information, information);
            pass.information = information;
            change = true;
        }
        if (pass.properties != properties) {
            emit PropertiesChanged(id, pass.properties, properties);
            pass.properties = properties;
            change = true;
        }
        if (pass.manufacturingInformation != manufacturingInformation) {
            emit ManufacturingInformationChanged(id, pass.manufacturingInformation, manufacturingInformation);
            pass.manufacturingInformation = manufacturingInformation;
            change = true;
        }
        if (pass.lifecycleInformation != lifecycleInformation) {
            emit LifecycleInformationChanged(id, pass.lifecycleInformation, lifecycleInformation);
            pass.lifecycleInformation = lifecycleInformation;
            change = true;
        }
        require(change, "There are no changes");
        pass.updated = now;
    }

    function passport(uint256 id) public view returns (bytes32) {
        Passport storage pass = things[id];
        require(pass.updated != 0, "Passport doesn't exist");
        return keccak256(abi.encodePacked(
                id,
                pass.owner,
                pass.fingerprints,
                pass.information,
                pass.properties,
                pass.manufacturingInformation,
                pass.lifecycleInformation));
    }

    function details(uint256 id) public view returns (
        uint256 updated,
        bytes32 owner,
        bytes32 fingerprints,
        bytes32 information,
        bytes32 properties,
        bytes32 manufacturingInformation,
        bytes32 lifecycleInformation
    ) {
        Passport storage pass = things[id];
        require(pass.updated != 0, "Passport doesn't exist");
        updated = pass.updated;
        owner = pass.owner;
        fingerprints = pass.fingerprints;
        information = pass.information;
        properties = pass.properties;
        manufacturingInformation = pass.manufacturingInformation;
        lifecycleInformation = pass.lifecycleInformation;
    }

    event Created(
        uint256 indexed id
    );

    event OwnerChanged(
        uint256 indexed id,
        bytes32 from,
        bytes32 to
    );

    event InformationChanged(
        uint256 indexed id,
        bytes32 from,
        bytes32 to
    );

    event FingerprintsChanged(
        uint256 indexed id,
        bytes32 from,
        bytes32 to
    );

    event PropertiesChanged(
        uint256 indexed id,
        bytes32 from,
        bytes32 to
    );

    event ManufacturingInformationChanged(
        uint256 indexed id,
        bytes32 from,
        bytes32 to
    );

    event LifecycleInformationChanged(
        uint256 indexed id,
        bytes32 from,
        bytes32 to
    );
}
