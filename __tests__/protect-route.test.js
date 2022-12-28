const { protectRoute } = require("../server/middlewares/helpers/protect-route")

describe('Protect routes', () => {
    describe('Normal fields', () => {
        it('should only populate what is allowed', () => {
            let query = { fields: ["a", "b"] }
            info = { fields: ["b"] }
            expect(protectRoute(query, info)).toMatchSnapshot()
        })
        it('should return only the fields in info when fields does not exist', () => {
            let query = {}
            info = { fields: ["b"] }
            expect(protectRoute(query, info)).toMatchSnapshot()
        })
        it('should return full info when unexpected fields input', () => {
            let query = { fields: "t" }
            info = { fields: ["b"] }
            expect(protectRoute(query, info)).toMatchSnapshot()
        })
        it('should return no fields noting', () => {
            let query = { fields: ["a"] }
            info = {}
            expect(protectRoute(query, info)).toMatchSnapshot()
        })
        it('should return correctly if nested in populate', () => {
            let query = { populate: { abc: { fields: ["a", "b"] } } }
            info = { populate: { abc: { fields: ["b"] } } }
            expect(protectRoute(query, info)).toMatchSnapshot()
        })
    })
    describe('Normal populate', () => {
        it('populate should only populate if in info', () => {
            let query = { populate: { a: {}, b: {} } }
            info = { populate: { b: {} } }
            expect(protectRoute(query, info)).toMatchSnapshot()
        })
        it('populate should not populate anyting if info has no populate', () => {
            let query = { populate: { a: {}, b: {} } }
            info = {}
            expect(protectRoute(query, info)).toMatchSnapshot()
        })
        it('populate should not populate anyting if quary has no populate', () => {
            let query = {}
            info = { populate: { a: {}, b: {} } }
            expect(protectRoute(query, info)).toMatchSnapshot()
        })
    })
    describe('Normal array populate', () => {
        it('populate should only populate should handle 3 populates', () => {
            let query = { populate: ["a.b.c"] }
            info = {
                populate: {
                    a: {
                        populate: {
                            b: {
                                populate: {
                                    c: {
                                        fields: ["a", "b"]
                                    }
                                }
                            }
                        }
                    }
                }
            }
            expect(protectRoute(query, info)).toMatchSnapshot()
        })
        it('populate should still protect in array', () => {
            let query = { populate: ["a.b.c"] }
            info = {
                populate: {
                    a: {
                        populate: {
                            b: {
                            }
                        }
                    }
                }
            }
            expect(protectRoute(query, info)).toMatchSnapshot()
        })
    })
    describe('Normal * populate', () => {
        it('populate * should only show first level down', () => {
            let query = { populate: "*" }
            info = {
                populate: {
                    a: {
                        fields: ["a", "z"],
                        populate: {
                            b: {
                                fields: ["a", "b"]
                            }
                        }
                    },
                }
            }
            expect(protectRoute(query, info)).toMatchSnapshot()
        })
    })
    describe('Normal object = true populate', () => {
        it('populate a: true should populate 1 level of a only', () => {
            let query = { populate: { a: true } }
            info = {
                populate: {
                    a: {
                        fields: ["a", "z"],
                        populate: {
                            b: {
                                fields: ["a", "b"]
                            }
                        }
                    },
                    b: {
                        fields: ["a", "z"],
                        populate: {
                            b: {
                                fields: ["a", "b"]
                            }
                        }
                    }
                }
            }
            expect(protectRoute(query, info)).toMatchSnapshot()
        })
    })

    describe('DZ populate fields', () => {
        it('populate DZ fields', () => {
            let query = { fields: ["c", "f", "z"] }
            info = {
                "on": {
                    "a.a": {
                        "fields": [
                            "c",
                            "d"
                        ],
                        "populate": {
                            "c": {
                                "fields": [
                                    "a",
                                    "b"
                                ]
                            },
                            "d": {
                                "fields": [
                                    "a",
                                    "b"
                                ]
                            }
                        }
                    },
                    "a.b": {
                        "fields": [
                            "c",
                            "d"
                        ],
                        "populate": {
                            "c": {
                                "fields": [
                                    "a",
                                    "b"
                                ]
                            }
                        }
                    },
                    "a.c": {
                        "fields": [
                            "e",
                            "f"
                        ],
                        "populate": {
                            "c": {
                                "fields": [
                                    "a",
                                    "b"
                                ]
                            }
                        }
                    }
                }
            }

            expect(protectRoute(query, info)).toMatchSnapshot()
        })
    })
    describe('DZ populate', () => {
        it('should populate DZ and split populate between all components', () => {
            let query = {
                populate: {
                    c: {},
                    d: {}
                }
            }
            info = {
                "on": {
                    "a.a": {
                        "fields": [
                            "c",
                            "d"
                        ],
                        "populate": {
                            "c": {
                                "fields": [
                                    "a",
                                    "b"
                                ]
                            },
                            "d": {
                                "fields": [
                                    "a",
                                    "b"
                                ]
                            }
                        }
                    },
                    "a.b": {
                        "fields": [
                            "c",
                            "d"
                        ],
                        "populate": {
                            "c": {
                                "fields": [
                                    "a",
                                    "b"
                                ]
                            }
                        }
                    },
                    "a.c": {
                        "fields": [
                            "e",
                            "f"
                        ],
                        "populate": {
                            "f": {
                                "fields": [
                                    "a",
                                    "b"
                                ]
                            }
                        }
                    }
                }
            }
            expect(protectRoute(query, info)).toMatchSnapshot()
        })
    })
    describe('DZ array populate', () => {
        it('should populate DZ with populate array', () => {
            let query = {
                populate: ["c", "d"]
            }
            info = {
                "on": {
                    "a.a": {
                        "fields": [
                            "c",
                            "d"
                        ],
                        "populate": {
                            "c": {
                                "fields": [
                                    "a",
                                    "b"
                                ]
                            },
                            "d": {
                                "fields": [
                                    "a",
                                    "b"
                                ]
                            }
                        }
                    },
                    "a.b": {
                        "fields": [
                            "c",
                            "d"
                        ],
                        "populate": {
                            "c": {
                                "fields": [
                                    "a",
                                    "b"
                                ]
                            }
                        }
                    },
                    "a.c": {
                        "fields": [
                            "e",
                            "f"
                        ],
                        "populate": {
                            "f": {
                                "fields": [
                                    "a",
                                    "b"
                                ]
                            }
                        }
                    }
                }
            }
            expect(protectRoute(query, info)).toMatchSnapshot()
        })
    })
    describe('DZ populate *', () => {
        it('should populate DZ *', () => {
            let query = {
                populate: "*"
            }
            info = {
                populate: {
                    "dz": {
                        "on": {
                            "a.a": {
                                "fields": [
                                    "c",
                                    "d"
                                ],
                                "populate": {
                                    "c": {
                                        "fields": [
                                            "a",
                                            "b"
                                        ]
                                    },
                                    "d": {
                                        "fields": [
                                            "a",
                                            "b"
                                        ]
                                    }
                                }
                            },
                            "a.b": {
                                "fields": [
                                    "c",
                                    "d"
                                ],
                                "populate": {
                                    "c": {
                                        "fields": [
                                            "a",
                                            "b"
                                        ]
                                    }
                                }
                            },
                            "a.c": {
                                "fields": [
                                    "e",
                                    "f"
                                ],
                                "populate": {
                                    "f": {
                                        "fields": [
                                            "a",
                                            "b"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    abc: {
                        fields: ["a", "b"],
                        "populate": {
                            "f": {
                                "fields": [
                                    "a",
                                    "b"
                                ]
                            }
                        }
                    }
                }
            }
            expect(protectRoute(query, info)).toMatchSnapshot()
        })
    })
    describe('DZ object = true', () => {
        it('should populate DZ if DZ value is true', () => {
            let query = {
                populate: {
                    dz: true
                }
            }
            info = {
                populate: {
                    "dz": {
                        "on": {
                            "a.a": {
                                "fields": [
                                    "c",
                                    "d"
                                ],
                                "populate": {
                                    "c": {
                                        "fields": [
                                            "a",
                                            "b"
                                        ]
                                    },
                                    "d": {
                                        "fields": [
                                            "a",
                                            "b"
                                        ]
                                    }
                                }
                            },
                            "a.b": {
                                "fields": [
                                    "c",
                                    "d"
                                ],
                                "populate": {
                                    "c": {
                                        "fields": [
                                            "a",
                                            "b"
                                        ]
                                    }
                                }
                            },
                            "a.c": {
                                "fields": [
                                    "e",
                                    "f"
                                ],
                                "populate": {
                                    "f": {
                                        "fields": [
                                            "a",
                                            "b"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    abc: {
                        fields: ["a", "b"],
                        "populate": {
                            "f": {
                                "fields": [
                                    "a",
                                    "b"
                                ]
                            }
                        }
                    }
                }
            }
            expect(protectRoute(query, info)).toMatchSnapshot()
        })
    })

    describe('DZ on', () => {
        it('should populate DZ name only if on is empty', () => {
            let query = {
                populate: {
                    dz: {
                        on: {}
                    }
                }
            }
            info = {
                populate: {
                    "dz": {
                        "on": {
                            "a.a": {
                                "fields": [
                                    "c",
                                    "d"
                                ],
                                "populate": {
                                    "c": {
                                        "fields": [
                                            "a",
                                            "b"
                                        ]
                                    },
                                    "d": {
                                        "fields": [
                                            "a",
                                            "b"
                                        ]
                                    }
                                }
                            },
                            "a.b": {
                                "fields": [
                                    "c",
                                    "d"
                                ],
                                "populate": {
                                    "c": {
                                        "fields": [
                                            "a",
                                            "b"
                                        ]
                                    }
                                }
                            },
                            "a.c": {
                                "fields": [
                                    "e",
                                    "f"
                                ],
                                "populate": {
                                    "f": {
                                        "fields": [
                                            "a",
                                            "b"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    abc: {
                        fields: ["a", "b"],
                        "populate": {
                            "f": {
                                "fields": [
                                    "a",
                                    "b"
                                ]
                            }
                        }
                    }
                }
            }
            expect(protectRoute(query, info)).toMatchSnapshot()
        })


        it('should populate DZ only selected fields/populates', () => {
            let query = {
                populate: {
                    dz: {
                        on: {
                            "a.a": {
                                "fields": [
                                    "c",
                                ],
                                "populate": {
                                    "c": {
                                        "fields": [
                                            "a",
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
            info = {
                populate: {
                    "dz": {
                        "on": {
                            "a.a": {
                                "fields": [
                                    "c",
                                    "d"
                                ],
                                "populate": {
                                    "c": {
                                        "fields": [
                                            "a",
                                            "b"
                                        ]
                                    },
                                    "d": {
                                        "fields": [
                                            "a",
                                            "b"
                                        ]
                                    }
                                }
                            },
                            "a.b": {
                                "fields": [
                                    "c",
                                    "d"
                                ],
                                "populate": {
                                    "c": {
                                        "fields": [
                                            "a",
                                            "b"
                                        ]
                                    }
                                }
                            },
                            "a.c": {
                                "fields": [
                                    "e",
                                    "f"
                                ],
                                "populate": {
                                    "f": {
                                        "fields": [
                                            "a",
                                            "b"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    abc: {
                        fields: ["a", "b"],
                        "populate": {
                            "f": {
                                "fields": [
                                    "a",
                                    "b"
                                ]
                            }
                        }
                    }
                }
            }
            expect(protectRoute(query, info)).toMatchSnapshot()
        })
    })
})