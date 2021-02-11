const dockerFetchOneContainerSample = {
  Id: '768048e257e7307b6b497d3703c7b1386d57baec8e19014d3f47f45c94dcec99',
  Created: '2020-12-11T17:33:09.869733427Z',
  Path: '/start.sh',
  Args: [],
  State: {
    Status: 'running',
    Running: true,
    Paused: false,
    Restarting: false,
    OOMKilled: false,
    Dead: false,
    Pid: 1860902,
    ExitCode: 0,
    Error: '',
    StartedAt: '2020-12-11T17:33:10.87356797Z',
    FinishedAt: '0001-01-01T00:00:00Z',
  },
  Image: 'sha256:3747c50839f85c934cc05df0590cd1fe4a53c4cc5d229f532a0887785fa47c62',
  ResolvConfPath: '/var/lib/docker/containers/768048e257e7307b6b497d3703c7b1386d57baec8e19014d3f47f45c94dcec99/resolv.conf',
  HostnamePath: '/var/lib/docker/containers/768048e257e7307b6b497d3703c7b1386d57baec8e19014d3f47f45c94dcec99/hostname',
  HostsPath: '/var/lib/docker/containers/768048e257e7307b6b497d3703c7b1386d57baec8e19014d3f47f45c94dcec99/hosts',
  LogPath: '',
  Name: '/a2668cd7e4a0fc616e4531313655d048bf25f6ce59d2580d56798b37ff327f9a-mreport',
  RestartCount: 0,
  Driver: 'overlay2',
  Platform: 'linux',
  MountLabel: '',
  ProcessLabel: '',
  AppArmorProfile: 'docker-default',
  ExecIDs: null,
  HostConfig: {
    Binds: [
      'a2668cd7e4a0fc616e4531313655d048bf25f6ce59d2580d56798b37ff327f9a:/service_config:rw',
      '/var/tmp/horizon/anax_bc8ebd2abf839833/fss-domain-socket:/var/tmp/horizon/anax_bc8ebd2abf839833/fss-domain-socket',
      '/var/tmp/horizon/anax_bc8ebd2abf839833/ess-auth/a2668cd7e4a0fc616e4531313655d048bf25f6ce59d2580d56798b37ff327f9a:/ess-auth:ro',
      '/var/tmp/horizon/anax_bc8ebd2abf839833/ess-auth/SSL/cert:/ess-cert:ro',
    ],
    ContainerIDFile: '',
    LogConfig: { Type: 'json-file' },
    NetworkMode: 'a2668cd7e4a0fc616e4531313655d048bf25f6ce59d2580d56798b37ff327f9a',
    PortBindings: { },
    RestartPolicy: { Name: 'always', MaximumRetryCount: 0 },
    AutoRemove: false,
    VolumeDriver: '',
    VolumesFrom: null,
    CapAdd: null,
    CapDrop: null,
    Capabilities: null,
    Dns: null,
    DnsOptions: null,
    DnsSearch: null,
    ExtraHosts: null,
    GroupAdd: null,
    IpcMode: 'private',
    Cgroup: '',
    Links: null,
    OomScoreAdj: 0,
    PidMode: '',
    Privileged: false,
    PublishAllPorts: false,
    ReadonlyRootfs: false,
    SecurityOpt: null,
    UTSMode: '',
    UsernsMode: '',
    ShmSize: 67108864,
    Runtime: 'runc',
    ConsoleSize: [0, 0],
    Isolation: '',
    CpuShares: 0,
    Memory: 3964665856,
    NanoCpus: 0,
    CgroupParent: '',
    BlkioWeight: 0,
    BlkioWeightDevice: null,
    BlkioDeviceReadBps: null,
    BlkioDeviceWriteBps: null,
    BlkioDeviceReadIOps: null,
    BlkioDeviceWriteIOps: null,
    CpuPeriod: 0,
    CpuQuota: 0,
    CpuRealtimePeriod: 0,
    CpuRealtimeRuntime: 0,
    CpusetCpus: '',
    CpusetMems: '',
    Devices: null,
    DeviceCgroupRules: null,
    DeviceRequests: null,
    KernelMemory: 0,
    KernelMemoryTCP: 0,
    MemoryReservation: 0,
    MemorySwap: -1,
    MemorySwappiness: null,
    OomKillDisable: false,
    PidsLimit: null,
    Ulimits: null,
    CpuCount: 0,
    CpuPercent: 0,
    IOMaximumIOps: 0,
    IOMaximumBandwidth: 0,
    MaskedPaths: [
      '/proc/asound',
      '/proc/acpi',
      '/proc/kcore',
      '/proc/keys',
      '/proc/latency_stats',
      '/proc/timer_list',
      '/proc/timer_stats',
      '/proc/sched_debug',
      '/proc/scsi',
      '/sys/firmware',
    ],
    ReadonlyPaths: [
      '/proc/bus',
      '/proc/fs',
      '/proc/irq',
      '/proc/sys',
      '/proc/sysrq-trigger',
    ],
  },
  GraphDriver: {
    Data: {
      // eslint-disable-next-line max-len
      LowerDir: '/var/lib/docker/overlay2/395e99c4ef1dc11a434cf8cd0968837998b567b64eb04c696b243f5ee87d1a49-init/diff:/var/lib/docker/overlay2/770dd4ef101d14ca74735e61eb979ba4f82082b577350396e5ba78eb8a628a97/diff:/var/lib/docker/overlay2/3fd603eac5c613320c1fcaf772c9ddf5b5fde9657c7bdd1105f0ad1a814aa520/diff:/var/lib/docker/overlay2/f163b892b9d94b938d39fddc3a74e9f9f375eada9c0ed61f2104110801184774/diff:/var/lib/docker/overlay2/cd0eb686c43d7f56690113b8c751580d3c1cf5529ae0ca83a1d9eb08109bbabd/diff:/var/lib/docker/overlay2/9a4fe60436b0f8f6fd6e74b1e9a5f3af61b91226f42d04213b0ee66709638682/diff:/var/lib/docker/overlay2/0e20f40953191fab927928881b4e88e478bc6e136f844aad05f9aa26b13a5cc9/diff',
      MergedDir: '/var/lib/docker/overlay2/395e99c4ef1dc11a434cf8cd0968837998b567b64eb04c696b243f5ee87d1a49/merged',
      UpperDir: '/var/lib/docker/overlay2/395e99c4ef1dc11a434cf8cd0968837998b567b64eb04c696b243f5ee87d1a49/diff',
      WorkDir: '/var/lib/docker/overlay2/395e99c4ef1dc11a434cf8cd0968837998b567b64eb04c696b243f5ee87d1a49/work',
    },
    Name: 'overlay2',
  },
  Mounts: [
    {
      Type: 'volume',
      Name: 'a2668cd7e4a0fc616e4531313655d048bf25f6ce59d2580d56798b37ff327f9a',
      Source: '/var/lib/docker/volumes/a2668cd7e4a0fc616e4531313655d048bf25f6ce59d2580d56798b37ff327f9a/_data',
      Destination: '/service_config',
      Driver: 'local',
      Mode: 'rw',
      RW: true,
      Propagation: '',
    },
    {
      Type: 'bind',
      Source: '/var/tmp/horizon/anax_bc8ebd2abf839833/fss-domain-socket',
      Destination: '/var/tmp/horizon/anax_bc8ebd2abf839833/fss-domain-socket',
      Mode: '',
      RW: true,
      Propagation: 'rprivate',
    },
    {
      Type: 'bind',
      Source: '/var/tmp/horizon/anax_bc8ebd2abf839833/ess-auth/a2668cd7e4a0fc616e4531313655d048bf25f6ce59d2580d56798b37ff327f9a',
      Destination: '/ess-auth',
      Mode: 'ro',
      RW: false,
      Propagation: 'rprivate',
    },
    {
      Type: 'bind',
      Source: '/var/tmp/horizon/anax_bc8ebd2abf839833/ess-auth/SSL/cert',
      Destination: '/ess-cert',
      Mode: 'ro',
      RW: false,
      Propagation: 'rprivate',
    },
  ],
  Config: {
    Hostname: '768048e257e7',
    Domainname: '',
    User: '',
    AttachStdin: false,
    AttachStdout: false,
    AttachStderr: false,
    ExposedPorts: { '80/tcp': {} },
    Tty: false,
    OpenStdin: false,
    StdinOnce: false,
    Env: [
      'HZN_EXCHANGE_URL=http://192.168.1.77:3090/v1/',
      'HZN_ESS_API_ADDRESS=/var/tmp/horizon/anax_bc8ebd2abf839833/fss-domain-socket/essapi.sock',
      'HZN_ESS_AUTH=/ess-auth/auth.json',
      'HZN_AGREEMENTID=a2668cd7e4a0fc616e4531313655d048bf25f6ce59d2580d56798b37ff327f9a',
      'HZN_ORGANIZATION=myorg',
      'HZN_PATTERN=',
      'HZN_ESS_API_PROTOCOL=secure-unix',
      'HZN_ESS_CERT=/ess-cert/cert.pem',
      'HZN_PRIVILEGED=false',
      'HZN_DEVICE_ID=bc8ebd2abf839833',
      'HZN_ESS_API_PORT=0',
      'HZN_CPUS=4',
      'HZN_ARCH=amd64',
      'HZN_HOST_IPS=127.0.0.1,172.17.0.3',
      'HZN_DEPLOYMENT_LOCATION=gatewayNode',
      'HZN_RAM=3781',
      'HZN_HARDWAREID=51bf4ceb0aa174dfbb7a3fdb2ff34f976d2e97b8',
      'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
    ],
    Cmd: ['/start.sh'],
    Image: 'kevintoor/mreport@sha256:1546c0c44601b13ec26f9891f0fd2f100c71b93dd3760889d16a4a3dcc49093f',
    Volumes: {
      '/ess-auth': {},
      '/ess-cert': {},
      '/service_config': {},
      '/var/tmp/horizon/anax_bc8ebd2abf839833/fss-domain-socket': {},
    },
    WorkingDir: '/',
    Entrypoint: null,
    OnBuild: null,
    Labels: {
      'openhorizon.anax.agreement_id': 'a2668cd7e4a0fc616e4531313655d048bf25f6ce59d2580d56798b37ff327f9a',
      'openhorizon.anax.deployment_description_hash': 'jSs0WEC9kp2kaSpx7E-j3Hj0tmw=',
      'openhorizon.anax.service_name': 'mreport',
      'openhorizon.anax.variation': '',
    },
  },
  NetworkSettings: {
    Bridge: '',
    SandboxID: '09b34bd6e2e4138800488f84098f5c31805618e083df52944e5fb4d7dfe34a95',
    HairpinMode: false,
    LinkLocalIPv6Address: '',
    LinkLocalIPv6PrefixLen: 0,
    Ports: { },
    SandboxKey: '/var/run/docker/netns/09b34bd6e2e4',
    SecondaryIPAddresses: null,
    SecondaryIPv6Addresses: null,
    EndpointID: '',
    Gateway: '',
    GlobalIPv6Address: '',
    GlobalIPv6PrefixLen: 0,
    IPAddress: '',
    IPPrefixLen: 0,
    IPv6Gateway: '',
    MacAddress: '',
    Networks: {},
  },
};
Object.freeze(dockerFetchOneContainerSample);

const dockerFetchAllContainerSample = {
  Id: '65ae19d08447d19ddff4afed84972289259a6c439761409b8d9933a376206df9',
  Names: [
    '/anax_bc8ebd2abf839833',
  ],
  Image: 'openhorizon/amd64_anax:latest',
  ImageID: 'sha256:00ff8ac15bf5691d9d776704d7f7fe48fa80657c85ec4f4d4ae474ef070e2306',
  Command: '/root/anax.service start',
  Created: 1607639812,
  // Created: Math.floor(Date.now() / 1000),
  Ports: [
    {
      IP: '127.0.0.1',
      PrivatePort: 8510,
      PublicPort: 8200,
      Type: 'tcp',
    },
  ],
  Labels: {
    architecture: 'x86_64',
    'authoritative-source-url': 'registry.access.redhat.com',
    'build-date': '2019-09-16T12:28:09.399802',
    'com.redhat.build-host': 'cpt-1002.osbs.prod.upshift.rdu2.redhat.com',
    'com.redhat.component': 'ubi8-minimal-container',
    'com.redhat.license_terms': 'https://www.redhat.com/en/about/red-hat-end-user-license-agreements#UBI',
    description: 'A container which holds the edge node agent, to be used in environments where there is no operating system package that can install the agent natively.',
    'distribution-scope': 'public',
    'io.k8s.description': 'The Universal Base Image Minimal is a stripped down image that uses microdnf as a package manage.',
    'io.k8s.display-name': 'Red Hat Universal Base Image 8 Minimal',
    'io.openshift.expose-services': '',
    'io.openshift.tags': 'minimal rhel8',
    maintainer: 'Red Hat, Inc.',
    name: 'amd64_anax',
    release: '69987ccd',
    summary: 'The agent in a general purpose container.',
    url: 'https://access.redhat.com/containers/#/registry.access.redhat.com/ubi8-minimal/images/8.0-213',
    'vcs-ref': 'cd4b5a1918e11cd510080cc6ee5496bc730f16cf',
    'vcs-type': 'git',
    vendor: 'IBM',
    version: '2.27.0-173.202010230012.69987ccd',
  },
  State: 'running',
  Status: 'Up 2 minutes',
  HostConfig: {
    NetworkMode: 'default',
  },
  NetworkSettings: {
    Networks: {
      bridge: {
        IPAMConfig: null,
        Links: null,
        Aliases: null,
        NetworkID: '5be4f9efababc8cf37c923ec99fb21a057abcae25162ca6775566b270d874d1f',
        EndpointID: 'db485e0634f5b79e65736a9623a7d8375b4b02099d4a71939c45d134dd84f5e8',
        Gateway: '172.17.0.1',
        IPAddress: '172.17.0.3',
        IPPrefixLen: 16,
        IPv6Gateway: '',
        GlobalIPv6Address: '',
        GlobalIPv6PrefixLen: 0,
        MacAddress: '02:42:ac:11:00:03',
        DriverOpts: null,
      },
    },
  },
  Mounts: [
    {
      Type: 'bind',
      Source: '/var/tmp/oh/sockets/edgeDaemon_bc8ebd2abf8398338c9f8a64cc6ffb14167601a684c953f3aac39c1d.sock',
      Destination: '/var/run/docker.sock',
      Mode: '',
      RW: true,
      Propagation: 'rprivate',
    },
    {
      Type: 'bind',
      Source: '/var/tmp/oh/storage/bc8ebd2abf839833',
      Destination: '/var/tmp/horizon/anax_bc8ebd2abf839833',
      Mode: '',
      RW: true,
      Propagation: 'rprivate',
    },
    {
      Type: 'bind',
      Source: '/etc/default/horizon',
      Destination: '/etc/default/horizon',
      Mode: 'ro',
      RW: false,
      Propagation: 'rprivate',
    },
    {
      Type: 'volume',
      Name: 'anax_bc8ebd2abf839833_etc',
      Source: '/var/lib/docker/volumes/anax_bc8ebd2abf839833_etc/_data',
      Destination: '/etc/horizon',
      Driver: 'local',
      Mode: 'z',
      RW: true,
      Propagation: '',
    },
    {
      Type: 'volume',
      Name: 'anax_bc8ebd2abf839833_var',
      Source: '/var/lib/docker/volumes/anax_bc8ebd2abf839833_var/_data',
      Destination: '/var/horizon',
      Driver: 'local',
      Mode: 'z',
      RW: true,
      Propagation: '',
    },
  ],
};
Object.freeze(dockerFetchAllContainerSample);

module.exports = {
  dockerFetchOneContainerSample,
  dockerFetchAllContainerSample,
};
