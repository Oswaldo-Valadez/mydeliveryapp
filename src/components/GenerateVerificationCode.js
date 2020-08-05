import React from 'react';

export default function GenerateVerificationCode() {
    const aleatoryhash = parseInt((Math.random() * 8999) + 1000);

    let hashkey = '';
    hashkey = hashkey.concat(aleatoryhash.toString());

    return hashkey;
}