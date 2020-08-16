#!/bin/bash

# Exit on first error
set -ex

# Bring the test network down
pushd ../network
./network.sh down
popd

# clean out any old identites in the wallets
rm -rf typescript/wallet/*
