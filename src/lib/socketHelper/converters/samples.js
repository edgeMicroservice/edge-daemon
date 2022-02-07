const dockerFetchOneContainerSample = {
  "Id": "dede055eff00a1b4f547e80f56d728cd4364c68ff9134f67c8ab9b07e6a0619e",
  "Created": "2022-02-03T21:00:09.850455946Z",
  "Path": "/start.sh",
  "Args": [],
  "State": {
    "Status": "running",
    "Running": true,
    "Paused": false,
    "Restarting": false,
    "OOMKilled": false,
    "Dead": false,
    "Pid": 156884,
    "ExitCode": 0,
    "Error": "",
    "StartedAt": "2022-02-03T21:00:12.371000981Z",
    "FinishedAt": "0001-01-01T00:00:00Z"
  },
  "Image": "sha256:f4370a4bfbdc31a406d37a2a4541b8014e516bd435b04dfa75eb4800748d45d5",
  "ResolvConfPath": "/var/lib/docker/containers/dede055eff00a1b4f547e80f56d728cd4364c68ff9134f67c8ab9b07e6a0619e/resolv.conf",
  "HostnamePath": "/var/lib/docker/containers/dede055eff00a1b4f547e80f56d728cd4364c68ff9134f67c8ab9b07e6a0619e/hostname",
  "HostsPath": "/var/lib/docker/containers/dede055eff00a1b4f547e80f56d728cd4364c68ff9134f67c8ab9b07e6a0619e/hosts",
  "LogPath": "",
  "Name": "/84b90c90bb683dcde032ee253846765cc082dad49db28b9d987639b5a1ff0379-mreport",
  "RestartCount": 0,
  "Driver": "overlay2",
  "Platform": "linux",
  "MountLabel": "",
  "ProcessLabel": "",
  "AppArmorProfile": "docker-default",
  "ExecIDs": null,
  "HostConfig": {
    "Binds": [
      "84b90c90bb683dcde032ee253846765cc082dad49db28b9d987639b5a1ff0379:/service_config:rw",
      "/var/tmp/horizon/anax_ee1a6e7c69e22f30:/var/tmp/horizon/anax_ee1a6e7c69e22f30",
      "/var/horizon/ess-auth/84b90c90bb683dcde032ee253846765cc082dad49db28b9d987639b5a1ff0379:/ess-auth:ro",
      "/var/horizon/ess-auth/SSL/cert:/ess-cert:ro"
    ],
    "ContainerIDFile": "",
    "LogConfig": {
      "Type": "syslog",
      "Config": {
        "tag": "workload-84b90c90bb683dcde032ee253846765cc082dad49db28b9d987639b5a1ff0379_mreport"
      }
    },
    "NetworkMode": "84b90c90bb683dcde032ee253846765cc082dad49db28b9d987639b5a1ff0379",
    "PortBindings": null,
    "RestartPolicy": {
      "Name": "always",
      "MaximumRetryCount": 0
    },
    "AutoRemove": false,
    "VolumeDriver": "",
    "VolumesFrom": null,
    "CapAdd": null,
    "CapDrop": null,
    "CgroupnsMode": "host",
    "Dns": null,
    "DnsOptions": null,
    "DnsSearch": null,
    "ExtraHosts": null,
    "GroupAdd": [
      "1000"
    ],
    "IpcMode": "private",
    "Cgroup": "",
    "Links": null,
    "OomScoreAdj": 0,
    "PidMode": "",
    "Privileged": false,
    "PublishAllPorts": false,
    "ReadonlyRootfs": false,
    "SecurityOpt": null,
    "UTSMode": "",
    "UsernsMode": "",
    "ShmSize": 67108864,
    "Runtime": "runc",
    "ConsoleSize": [
      0,
      0
    ],
    "Isolation": "",
    "CpuShares": 0,
    "Memory": 8325693440,
    "NanoCpus": 0,
    "CgroupParent": "",
    "BlkioWeight": 0,
    "BlkioWeightDevice": null,
    "BlkioDeviceReadBps": null,
    "BlkioDeviceWriteBps": null,
    "BlkioDeviceReadIOps": null,
    "BlkioDeviceWriteIOps": null,
    "CpuPeriod": 0,
    "CpuQuota": 0,
    "CpuRealtimePeriod": 0,
    "CpuRealtimeRuntime": 0,
    "CpusetCpus": "",
    "CpusetMems": "",
    "Devices": null,
    "DeviceCgroupRules": null,
    "DeviceRequests": null,
    "KernelMemory": 0,
    "KernelMemoryTCP": 0,
    "MemoryReservation": 0,
    "MemorySwap": -1,
    "MemorySwappiness": null,
    "OomKillDisable": false,
    "PidsLimit": null,
    "Ulimits": null,
    "CpuCount": 0,
    "CpuPercent": 0,
    "IOMaximumIOps": 0,
    "IOMaximumBandwidth": 0,
    "MaskedPaths": [
      "/proc/asound",
      "/proc/acpi",
      "/proc/kcore",
      "/proc/keys",
      "/proc/latency_stats",
      "/proc/timer_list",
      "/proc/timer_stats",
      "/proc/sched_debug",
      "/proc/scsi",
      "/sys/firmware"
    ],
    "ReadonlyPaths": [
      "/proc/bus",
      "/proc/fs",
      "/proc/irq",
      "/proc/sys",
      "/proc/sysrq-trigger"
    ]
  },
  "GraphDriver": {
    "Data": {
      "LowerDir": "/var/lib/docker/overlay2/e94fa1952dec6270ff4292f27d7f810b0d850afe0889377fb4594930f3b0d447-init/diff:/var/lib/docker/overlay2/911c331e017501db0823181de43cca6ef0065eacb6b7d8a67b06f220d118babd/diff:/var/lib/docker/overlay2/75136ef97631d716d7bf6e6af07f19e8516782bb2dda89d682106fbb5960245a/diff:/var/lib/docker/overlay2/99b76827bdd3ae52dc7f1a284db206b40e1a6bed2d706531f39771a5b9bcd5ca/diff:/var/lib/docker/overlay2/402b9bf37f482d6074b6def2b691bbc665041110bcb60cc34f211019c46698cb/diff:/var/lib/docker/overlay2/7a3b4c1253232564136fa72130016c7ef82396a05c7e78c78493853698a762a5/diff:/var/lib/docker/overlay2/6f555e6be0a631fede261817fd322b5fbe504a67f1386764f733eb3897d5e39b/diff",
      "MergedDir": "/var/lib/docker/overlay2/e94fa1952dec6270ff4292f27d7f810b0d850afe0889377fb4594930f3b0d447/merged",
      "UpperDir": "/var/lib/docker/overlay2/e94fa1952dec6270ff4292f27d7f810b0d850afe0889377fb4594930f3b0d447/diff",
      "WorkDir": "/var/lib/docker/overlay2/e94fa1952dec6270ff4292f27d7f810b0d850afe0889377fb4594930f3b0d447/work"
    },
    "Name": "overlay2"
  },
  "Mounts": [
    {
      "Type": "bind",
      "Source": "/var/tmp/horizon/anax_ee1a6e7c69e22f30",
      "Destination": "/var/tmp/horizon/anax_ee1a6e7c69e22f30",
      "Mode": "",
      "RW": true,
      "Propagation": "rprivate"
    },
    {
      "Type": "bind",
      "Source": "/var/horizon/ess-auth/84b90c90bb683dcde032ee253846765cc082dad49db28b9d987639b5a1ff0379",
      "Destination": "/ess-auth",
      "Mode": "ro",
      "RW": false,
      "Propagation": "rprivate"
    },
    {
      "Type": "bind",
      "Source": "/var/horizon/ess-auth/SSL/cert",
      "Destination": "/ess-cert",
      "Mode": "ro",
      "RW": false,
      "Propagation": "rprivate"
    },
    {
      "Type": "volume",
      "Name": "84b90c90bb683dcde032ee253846765cc082dad49db28b9d987639b5a1ff0379",
      "Source": "/var/lib/docker/volumes/84b90c90bb683dcde032ee253846765cc082dad49db28b9d987639b5a1ff0379/_data",
      "Destination": "/service_config",
      "Driver": "local",
      "Mode": "rw",
      "RW": true,
      "Propagation": ""
    }
  ],
  "Config": {
    "Hostname": "dede055eff00",
    "Domainname": "",
    "User": "",
    "AttachStdin": false,
    "AttachStdout": false,
    "AttachStderr": false,
    "ExposedPorts": {
      "80/tcp": {}
    },
    "Tty": false,
    "OpenStdin": false,
    "StdinOnce": false,
    "Env": [
      "HZN_PATTERN=",
      "HZN_EXCHANGE_URL=http://10.0.0.8:3090/v1/",
      "HZN_ESS_API_PROTOCOL=secure-unix",
      "HZN_PRIVILEGED=false",
      "MCM.BASE_API_PATH=/mreport/v1",
      "HZN_AGREEMENTID=84b90c90bb683dcde032ee253846765cc082dad49db28b9d987639b5a1ff0379",
      "HZN_ORGANIZATION=myorg",
      "HZN_ESS_API_PORT=0",
      "HZN_ESS_CERT=/ess-cert/cert.pem",
      "HZN_RAM=7940",
      "HZN_HARDWAREID=4a5c6d81c7605b229413f5369660431b13db0bef",
      "HZN_NODE_ID=ee1a6e7c69e22f30",
      "HZN_ESS_API_ADDRESS=/var/tmp/horizon/anax_ee1a6e7c69e22f30/essapi.sock",
      "HZN_CPUS=4",
      "HZN_DEVICE_ID=ee1a6e7c69e22f30",
      "HZN_ARCH=amd64",
      "HZN_HOST_IPS=127.0.0.1,172.17.0.4",
      "HZN_DEPLOYMENT_LOCATION=gatewayNode",
      "HZN_ESS_AUTH=/ess-auth/auth.json",
      "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
    ],
    "Cmd": [
      "/start.sh"
    ],
    "Image": "dhmacdeviceb/mreport@sha256:01b5f3a01cb9037c2feb002a308dd3792aa9bdbc5e82e3c6a58ea1a2bfc3d904",
    "Volumes": {
      "/ess-auth": {},
      "/ess-cert": {},
      "/service_config": {},
      "/var/tmp/horizon/anax_ee1a6e7c69e22f30": {}
    },
    "WorkingDir": "/",
    "Entrypoint": null,
    "OnBuild": null,
    "Labels": {
      "openhorizon.anax.agreement_id": "84b90c90bb683dcde032ee253846765cc082dad49db28b9d987639b5a1ff0379",
      "openhorizon.anax.deployment_description_hash": "7IZ-AH7uQqWAmmipf2az-Zkzomo=",
      "openhorizon.anax.service_name": "mreport",
      "openhorizon.anax.variation": ""
    }
  },
  "NetworkSettings": {
    "Bridge": "",
    "SandboxID": "59d378bf0ae9213ee692d853d69646b229594c2185191a47f282c2994ba9ff59",
    "HairpinMode": false,
    "LinkLocalIPv6Address": "",
    "LinkLocalIPv6PrefixLen": 0,
    "Ports": {
      "80/tcp": null
    },
    "SandboxKey": "/var/run/docker/netns/59d378bf0ae9",
    "SecondaryIPAddresses": null,
    "SecondaryIPv6Addresses": null,
    "EndpointID": "",
    "Gateway": "",
    "GlobalIPv6Address": "",
    "GlobalIPv6PrefixLen": 0,
    "IPAddress": "",
    "IPPrefixLen": 0,
    "IPv6Gateway": "",
    "MacAddress": "",
    "Networks": {
      "84b90c90bb683dcde032ee253846765cc082dad49db28b9d987639b5a1ff0379": {
        "IPAMConfig": null,
        "Links": null,
        "Aliases": [
          "mreport",
          "dede055eff00"
        ],
        "NetworkID": "2b0f361fe88706354360d4e426a2f98478545268cf261feb1e3c29d8d2fc9796",
        "EndpointID": "f8e7f38159da53fe83a5d69961ab1f079f6f6b8835e003710bf23f206f4b09bf",
        "Gateway": "192.168.160.1",
        "IPAddress": "192.168.160.2",
        "IPPrefixLen": 20,
        "IPv6Gateway": "",
        "GlobalIPv6Address": "",
        "GlobalIPv6PrefixLen": 0,
        "MacAddress": "02:42:c0:a8:a0:02",
        "DriverOpts": null
      }
    }
  }
};
Object.freeze(dockerFetchOneContainerSample);

const dockerFetchAllContainerSample = {
  "Id": "42230059bd95a03727569cd1cf87b64e6d3c4940fbe237d2a3087942301d1e8e",
  "Names": [
    "/83c5a076ff67bc4db44b93bc6e1d459b8fe5f1f5a416959b80b1f457ce02166f-mreport"
  ],
  "Image": "dhmacdeviceb/mreport@sha256:01b5f3a01cb9037c2feb002a308dd3792aa9bdbc5e82e3c6a58ea1a2bfc3d904",
  "ImageID": "sha256:f4370a4bfbdc31a406d37a2a4541b8014e516bd435b04dfa75eb4800748d45d5",
  "Command": "/start.sh",
  "Created": 1643918916,
  "Ports": [
    {
      "PrivatePort": 80,
      "Type": "tcp"
    }
  ],
  "Labels": {
    "openhorizon.anax.agreement_id": "83c5a076ff67bc4db44b93bc6e1d459b8fe5f1f5a416959b80b1f457ce02166f",
    "openhorizon.anax.deployment_description_hash": "mOq2P2DwJFu3xqYE0KiP2wXRvMc=",
    "openhorizon.anax.service_name": "mreport",
    "openhorizon.anax.variation": ""
  },
  "State": "running",
  "Status": "Up 6 seconds",
  "HostConfig": {
    "NetworkMode": "83c5a076ff67bc4db44b93bc6e1d459b8fe5f1f5a416959b80b1f457ce02166f"
  },
  "NetworkSettings": {
    "Networks": {
      "83c5a076ff67bc4db44b93bc6e1d459b8fe5f1f5a416959b80b1f457ce02166f": {
        "IPAMConfig": null,
        "Links": null,
        "Aliases": null,
        "NetworkID": "d3cd4554127949658f3c068fa0a5ef1e5b97fb57e415ecf3d7de37e4319eafc9",
        "EndpointID": "02c1ba945508affc7fce4c5e68b2bf8609dc769a6eac73135603c24af736bb46",
        "Gateway": "172.24.0.1",
        "IPAddress": "172.24.0.2",
        "IPPrefixLen": 16,
        "IPv6Gateway": "",
        "GlobalIPv6Address": "",
        "GlobalIPv6PrefixLen": 0,
        "MacAddress": "02:42:ac:18:00:02",
        "DriverOpts": null
      }
    }
  },
  "Mounts": [
    {
      "Type": "volume",
      "Name": "83c5a076ff67bc4db44b93bc6e1d459b8fe5f1f5a416959b80b1f457ce02166f",
      "Source": "/var/lib/docker/volumes/83c5a076ff67bc4db44b93bc6e1d459b8fe5f1f5a416959b80b1f457ce02166f/_data",
      "Destination": "/service_config",
      "Driver": "local",
      "Mode": "rw",
      "RW": true,
      "Propagation": ""
    },
    {
      "Type": "bind",
      "Source": "/var/tmp/horizon/anax_ee1a6e7c69e22f30",
      "Destination": "/var/tmp/horizon/anax_ee1a6e7c69e22f30",
      "Mode": "",
      "RW": true,
      "Propagation": "rprivate"
    },
    {
      "Type": "bind",
      "Source": "/var/horizon/ess-auth/83c5a076ff67bc4db44b93bc6e1d459b8fe5f1f5a416959b80b1f457ce02166f",
      "Destination": "/ess-auth",
      "Mode": "ro",
      "RW": false,
      "Propagation": "rprivate"
    },
    {
      "Type": "bind",
      "Source": "/var/horizon/ess-auth/SSL/cert",
      "Destination": "/ess-cert",
      "Mode": "ro",
      "RW": false,
      "Propagation": "rprivate"
    }
  ]
};
Object.freeze(dockerFetchAllContainerSample);



module.exports = {
  dockerFetchOneContainerSample,
  dockerFetchAllContainerSample,
};
