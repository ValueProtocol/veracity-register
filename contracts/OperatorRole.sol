pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/access/Roles.sol";

contract OperatorRole {
    using Roles for Roles.Role;

    event OperatorAdded(address indexed account);
    event OperatorRemoved(address indexed account);

    Roles.Role private operators;

    modifier onlyOperator() {
        require(isOperator(msg.sender), "Can be called only by contract operator");
        _;
    }

    constructor() internal {
        _addOperator(msg.sender);
    }

    function addOperator(address account) public onlyOperator {
        _addOperator(account);
    }

    function removeOperator(address account) public onlyOperator {
        _removeOperator(account);
    }

    function changeOperator(address oldAccount, address newAccount) public onlyOperator {
        _addOperator(newAccount);
        _removeOperator(oldAccount);
    }

    function isOperator(address account) public view returns (bool) {
        return operators.has(account);
    }

    function _addOperator(address account) internal {
        operators.add(account);
        emit OperatorAdded(account);
    }

    function _removeOperator(address account) internal {
        operators.remove(account);
        emit OperatorRemoved(account);
    }
}

