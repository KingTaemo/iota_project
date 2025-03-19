const {
    KeyPair,
    KeyType,
    MethodScope,
    IotaDocument,
    IotaVerificationMethod,
    IotaService,
    MethodRelationship,
    IotaIdentityClient,
  } = require('@iota/identity-wasm/node');
  const { Client } = require('@iota/client-wasm/node');
  
  // The endpoint of the IOTA node to use.
  const API_ENDPOINT = 'http://192.168.0.22:14265';
  
  /** Demonstrate how to create a DID Document. */
  async function main() {
    // Create a new client with the given network endpoint.
    const client = new Client({
      primaryNode: API_ENDPOINT,
      localPow: true,
    });
  
    const didClient = new IotaIdentityClient(client);
  
    // Get the Bech32 human-readable part (HRP) of the network.
    const networkHrp = await didClient.getNetworkHrp();
  
    // Create a new DID document with a placeholder DID.
    // The DID will be derived from the Alias Id of the Alias Output after publishing.
    const document = new IotaDocument(networkHrp);
  
    // Insert a new Ed25519 verification method in the DID document.
    let keypair = new KeyPair(KeyType.Ed25519);
    let method = new IotaVerificationMethod(
      document.id(),
      keypair.type(),
      keypair.public(),
      '#key-1',
    );
    document.insertMethod(method, MethodScope.VerificationMethod());
  
    // Attach a new method relationship to the existing method.
    document.attachMethodRelationship(
      document.id().join('#key-1'),
      MethodRelationship.Authentication,
    );
  
    // Add a new Service.
    const service = new IotaService({
      id: document.id().join('#linked-domain'),
      type: 'LinkedDomains',
      serviceEndpoint: 'https://iota.org/',
    });
    document.insertService(service);
  
    console.log(`Created document `, JSON.stringify(document.toJSON(), null, 2));
  }
  
  main();