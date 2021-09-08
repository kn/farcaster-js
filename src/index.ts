import { Wallet } from "@ethersproject/wallet";
import { FarcasterGuardianContentHost, SignedPost } from "./contentHost";
import { Farcaster } from "./farcaster";
import { AddressActivity } from "./api";

const _defaultFarcaster = new Farcaster();

/**
 * Signs and publishes a simple text string.
 * The post will be attributed to the username currently registered
 * to the given private key's address.
 */
export async function publishPost(
  privateKey: string,
  text: string,
  replyTo?: AddressActivity | string
): Promise<SignedPost> {
  const contentHost = new FarcasterGuardianContentHost(privateKey);
  const signer = new Wallet(privateKey);
  const address = await signer.getAddress();
  const user = await _defaultFarcaster.usernameRegistry.lookupByAddress(
    address
  );
  if (!user) {
    throw new Error(`no username registered for address ${address}`);
  }
  const unsignedPost = await _defaultFarcaster.preparePost({
    fromUsername: user.username,
    text,
    replyTo,
  });
  const signedPost = await Farcaster.signPost(unsignedPost, signer);
  await contentHost.publishPost(signedPost);
  return signedPost;
}

export default Farcaster;

export * from "./api";
export * from "./contentHost";
export * from "./serialization";
export * from "./userRegistry";
